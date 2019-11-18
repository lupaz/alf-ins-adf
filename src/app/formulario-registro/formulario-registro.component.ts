import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlfrescoService } from '../services/alfresco.service';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.scss']
})
export class FormularioRegistroComponent implements OnInit {
  //Constantes
  tareaValida: string = 'Ingresar datos y documentos';

  isLinear = true;
  datosPersonalesForm: FormGroup;
  documentosForm: FormGroup;
  processId: string = null;
  alfrescoService: AlfrescoService;
  existeId: boolean = null; //temporalmente true
  solicitudFueIngresada: boolean = false;
  finalizoCargaDatos: boolean = false;
  taskId: any;
  documentoID: any;
  documentoCUI: any;
  documentoConst: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.alfrescoService = new AlfrescoService();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const applicationId = params['processId'];
      if (applicationId && applicationId !== '0') {
        this.processId = params['processId'];
        this.validarIdProcess(this.processId);
      }
    });
    
    this.datosPersonalesForm = this.formBuilder.group({
      id: ['', Validators.required],
      cui: [''],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      numTelefono: [''],
    });
    this.documentosForm = this.formBuilder.group({
      docCUI: ['', Validators.required],
      docID: ['', Validators.required],
      constancia: ['', Validators.required],
    });
  }

  public selectFile(file): void {
    console.log('cargo lo siguiente ', file);
    this.documentoCUI = file;
    this.documentosForm.controls['docCUI'].setValue('' + file.name);
  }

  selectFile2(file) {
    console.log('cargo lo siguiente ', file);
    this.documentoID = file;
    this.documentosForm.controls['docID'].setValue('' + file.name);
  }

  selectFile3(file) {
    console.log('cargo lo siguiente ', file);
    this.documentoConst = file;
    this.documentosForm.controls['constancia'].setValue('' + file.name);
  }

  async validarIdProcess(processId) {
    let resLogin = await this.alfrescoService.login();
    if (resLogin) {
      let res = await this.alfrescoService.recuperarTareaActual(this.processId);
      if (res != null) {
        this.taskId = res;
        if (this.taskId.nombre == this.tareaValida) {
          this.existeId = true;
        } else {
          this.solicitudFueIngresada = true;
        }
      } else {
        this.existeId = false;
      }
      this.alfrescoService.logout();
    }else{
      alert('Error: no se pudo establecer conexión con el servidor, por favor intentelo más tarde.')
    }

  }

  async enviarDatos() {
    if (this.taskId != null) {
      let resLogin = await this.alfrescoService.login();
      if (resLogin) {
        let resDocCui = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoCUI);
        let resDocId = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoID);
        let resDocConst = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoConst);

        if (resDocCui != null && resDocId != null && resDocConst != null) {
          let formValues = {
            documentoCui: resDocCui+'',
            documentoId: resDocId +'',
            constanciaAprobacion: resDocConst+'',
            numeroId: this.datosPersonalesForm.controls['id'].value,
            numeroCui: this.datosPersonalesForm.controls['cui'].value,
            primerNombre: this.datosPersonalesForm.controls['primerNombre'].value,
            segundoNombre: this.datosPersonalesForm.controls['segundoNombre'].value,
            primerApellido: this.datosPersonalesForm.controls['primerApellido'].value,
            segundoApellido: this.datosPersonalesForm.controls['segundoApellido'].value,
            numeroTelefono: this.datosPersonalesForm.controls['numTelefono'].value,
          }
          let res = this.alfrescoService.completarTaskForm(formValues, this.taskId.id);
          if (res) {
            alert('AVISO: Datos enviado correctamente');
            this.finalizoCargaDatos = true;
          } else {
            alert('ERROR: No fue posible enviar los datos de su solicitud, por favor intenelo de nuevo más tarde.');
          }
        } else {
          alert('ERROR: en este momento no fue posible cargar los documentos, por favor intentente de nuevo más tarde');
        }
        this.alfrescoService.logout();
      } else {
        alert('ERROR: en este momento no podemos registrar su solicitud, por favor intentente de nuevo más tarde');
      }
    }
  }

}
