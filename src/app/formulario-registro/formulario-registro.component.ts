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
  waitSend: boolean = false;
  taskId: any;
  documentoID: any;
  documentoCUI: any;
  documentoConst: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.alfrescoService = new AlfrescoService();
  }

  ngOnInit() {
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
    this.route.params.subscribe(params => {
      const applicationId = params['processId'];
      if (applicationId && applicationId !== '0') {
        this.processId = params['processId'];
        this.validarIdProcess(this.processId);
      }
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
          await this.cargarDatosForm();
        } else {
          this.solicitudFueIngresada = true;
        }
      } else {
        this.existeId = false;
      }
      this.alfrescoService.logout();
    } else {
      alert('Error: no se pudo establecer conexión con el servidor, por favor intentelo más tarde.')
    }

  }

  async cargarDatosForm() {
    let datos = await this.alfrescoService.recuperarTaskFormVariables(this.taskId.id) as [];
    if (datos) {
      //seteamos lo valores del fomulario
      let aproboSol = datos.find(e => e['id'] == "aproboSolicitud");
      console.log('aprobo sol -->', aproboSol);
      if (aproboSol) {
        if (!aproboSol['value']) {
          this.datosPersonalesForm.controls['id'].setValue(datos.find(e => e['id'] == "numeroId")['value']);
          let numCUI = datos.find(e => e['id'] == "numeroCui")['value'];
          this.datosPersonalesForm.controls['cui'].setValue(numCUI ? numCUI : '');
          let priNombre = datos.find(e => e['id'] == "primerNombre")['value'];
          this.datosPersonalesForm.controls['primerNombre'].setValue(priNombre);
          let segNombre = datos.find(e => e['id'] == "segundoNombre")['value'];
          this.datosPersonalesForm.controls['segundoNombre'].setValue(segNombre ? segNombre : '');
          let priApellido = datos.find(e => e['id'] == "primerApellido")['value'];
          this.datosPersonalesForm.controls['primerApellido'].setValue(priApellido);
          let segApellido = datos.find(e => e['id'] == "segundoApellido")['value'];
          this.datosPersonalesForm.controls['segundoApellido'].setValue(segApellido ? segApellido : '');
          let numTel = datos.find(e => e['id'] == "numeroTelefono")['value'];
          this.datosPersonalesForm.controls['numTelefono'].setValue(numTel ? numTel : '');
          //set documentos
          this.documentoCUI = datos.find(e => e['id'] == "idDocCui")['value'];
          this.documentoID = datos.find(e => e['id'] == "idDocId")['value'];
          this.documentoConst = datos.find(e => e['id'] == "idDocCon")['value'];
        }
      }
    } else {
      alert('Error: No fue posible recuperar los valores del formulario, por favor intentelo más tarde.')
    }
  }

  async enviarDatos() {

    if (this.taskId != null) {
      this.waitSend = true;
      let resLogin = await this.alfrescoService.login();
      if (resLogin) {
        let resDocCui = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoCUI);
        let resDocId = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoID);
        let resDocConst = await this.alfrescoService.subirArchivoAlProceso(this.processId, this.documentoConst);

        if (resDocCui != null && resDocId != null && resDocConst != null) {
          let formValues = {
            documentoCui: resDocCui + '',
            documentoId: resDocId + '',
            constanciaAprobacion: resDocConst + '',
            idDocCui: resDocCui,
            idDocId: resDocId,
            idDocCon: resDocConst,
            numeroId: this.datosPersonalesForm.controls['id'].value,
            numeroCui: this.datosPersonalesForm.controls['cui'].value,
            primerNombre: this.datosPersonalesForm.controls['primerNombre'].value,
            segundoNombre: this.datosPersonalesForm.controls['segundoNombre'].value,
            primerApellido: this.datosPersonalesForm.controls['primerApellido'].value,
            segundoApellido: this.datosPersonalesForm.controls['segundoApellido'].value,
            numeroTelefono: this.datosPersonalesForm.controls['numTelefono'].value,
          }
          let res = await this.alfrescoService.completarTaskForm(formValues, this.taskId.id);
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
      this.waitSend = false;
    }
  }

}
