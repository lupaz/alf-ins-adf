import { Component, OnInit, Inject, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlfrescoService } from 'app/services/alfresco.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
var moment = require('moment');
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-formulario-revision',
  templateUrl: './formulario-revision.component.html',
  styleUrls: ['./formulario-revision.component.scss']
})
export class FormularioRevisionComponent implements OnInit {

  //Constantes
  tareaValida: string = 'Revisar Solicitud';

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
  errorRevision: string = null;
  errorRevisionDoc: string = null;

  //datos finalizar revision
  camposAprobadosRechazados: string = '';
  aproboSolicitud: boolean = false;
  comentarioEncargado: string = '';
  nombreCarpeta: string = '';
  fechaFinRevisión: string = '';

  aproboId: FormControl = new FormControl('', [Validators.required]);
  aproboPrimerNombre: FormControl = new FormControl('', [Validators.required]);
  aproboPrimerApellido: FormControl = new FormControl('', [Validators.required]);
  //Aprobación de documentos
  aproboDocCui: FormControl = new FormControl('', [Validators.required]);
  aproboDocId: FormControl = new FormControl('', [Validators.required]);
  aproboDocCons: FormControl = new FormControl('', [Validators.required]);
  //variables de encabezado
  numeroSolicitud: string = '';
  nombreSolicitante: string = '';
  numeroId: string = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog) {
    this.alfrescoService = new AlfrescoService();
  }

  ngOnInit() {
    this.datosPersonalesForm = this.formBuilder.group({
      id: [''],
      cui: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      numTelefono: [''],
      aproboId: this.aproboId,
      aproboPrimerNombre: this.aproboPrimerNombre,
      aproboPrimerApellido: this.aproboPrimerApellido
    });
    this.documentosForm = this.formBuilder.group({
      docCUI: [''],
      docID: [''],
      constancia: [''],
      aproboDocCui: this.aproboDocCui,
      aproboDocId: this.aproboDocId,
      aproboDocCons: this.aproboDocCons,
    });
    this.route.params.subscribe(params => {
      const applicationId = params['processId'];
      if (applicationId && applicationId !== '0') {
        this.processId = params['processId'];
        this.validarIdProcess(this.processId);
      }
    });
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
      await this.alfrescoService.logout();
    } else {
      this.showError();
    }

  }

  async cargarDatosForm() {
    let datos = await this.alfrescoService.recuperarTaskFormVariables(this.taskId.id) as [];
    if (datos) {
      //seteamos lo valores del fomulario
      this.numeroId = datos.find(e => e['id'] == "numeroId")['value']
      this.datosPersonalesForm.controls['id'].setValue(this.numeroId);
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
      //set nombre
      this.nombreSolicitante = priNombre + ' ' + priApellido;
      //set numeroSol
      this.numeroSolicitud = datos.find(e => e['id'] == "idSolicitud")['value'];
      //set documentos
      this.documentoCUI = datos.find(e => e['id'] == "idDocCui")['value'];
      this.documentoID = datos.find(e => e['id'] == "idDocId")['value'];
      this.documentoConst = datos.find(e => e['id'] == "idDocCon")['value'];
    } else {
      alert('Error: No fue posible recuperar los valores del formulario, por favor intentelo más tarde.')
    }
  }

  validarCampos() {
    this.errorRevision = null;
    if (!this.aproboId.valid) {
      this.errorRevision = "Apruebe o rechace el campo de *Número ID*";
      return;
    }
    if (!this.aproboPrimerNombre.valid) {
      this.errorRevision = "Apruebe o rechace el campo *Primer Nombre*";
      return;
    }
    if (!this.aproboPrimerApellido.valid) {
      this.errorRevision = "Apruebe o rechace el campo *Primer Apellido*";
      return;
    }
  }

  validarCamposDoc() {
    this.errorRevisionDoc = null;
    if (!this.aproboDocCui.valid) {
      this.errorRevisionDoc = "Apruebe o rechace el campo *Documento CUI*";
      return;
    }
    if (!this.aproboDocId.valid) {
      this.errorRevisionDoc = "Apruebe o rechace el campo *Documento ID*";
      return;
    }
    if (!this.aproboDocCons.valid) {
      this.errorRevisionDoc = "Apruebe o rechace el campo *Doc Constancia*";
      return;
    }
  }

  showError() {
    alert('Error: no se pudo establecer conexión con el servidor, por favor intentelo más tarde.');
  }

  async verDocCui() {
    await this.alfrescoService.login();
    //4009 es imagen
    let blob = await this.alfrescoService.recuperArchivo(this.documentoCUI);
    await this.alfrescoService.logout();

    /* var binaryData = [];
    binaryData.push(data);
    let blob=new Blob(binaryData); */
    console.log('tipo -->', blob);
    let url = URL.createObjectURL(blob);
    //console.log('urrrlll ',url);
    let tipo: any = blob.type.split('/');
    //console.log('tipo 2 --->',tipo);
    tipo[0] == 'image' ? this.vistaPreviaDoc(url, tipo[0]) : this.vistaPreviaDoc(url, tipo[1]);

  }

  async verDocId() {
    await this.alfrescoService.login();
    //4009 es imagen
    let blob = await this.alfrescoService.recuperArchivo(this.documentoID);
    await this.alfrescoService.logout();

    /* var binaryData = [];
    binaryData.push(data);
    let blob=new Blob(binaryData); */
    console.log('tipo -->', blob);
    let url = URL.createObjectURL(blob);
    console.log('urrrlll ', url);
    let tipo: any = blob.type.split('/');
    console.log('tipo 2 --->', tipo);
    tipo[0] == 'image' ? this.vistaPreviaDoc(url, tipo[0]) : this.vistaPreviaDoc(url, tipo[1]);

  }

  async verDocCon() {
    await this.alfrescoService.login();
    //4009 es imagen
    let blob = await this.alfrescoService.recuperArchivo(this.documentoConst);
    await this.alfrescoService.logout();

    /* var binaryData = [];
    binaryData.push(data);
    let blob=new Blob(binaryData); */
    console.log('tipo -->', blob);
    let url = URL.createObjectURL(blob);
    //console.log('urrrlll ',url);
    let tipo: any = blob.type.split('/');
    //console.log('tipo 2 --->',tipo);
    tipo[0] == 'image' ? this.vistaPreviaDoc(url, tipo[0]) : this.vistaPreviaDoc(url, tipo[1]);

  }

  vistaPreviaDoc(urlDoc, extension) {
    var ventana = window.open("", "", "width=900,height=700");
    if (!ventana) {
      alert("Por favor permitir las ventanas emergenteges.");
      return;
    } else if (extension === 'image') {
      ventana.document.write(`
      <head><title>VISTA PREVIA DOCUMENTO</title></head>
      <body>
      <div style="display: inline-block;height: 80%;width: 80%;text-align: center;">
        <img src="${urlDoc}" style="max-width=890px;max-height=690px;"/>
      </div>
      <body>
      ` );
    } else if (extension === 'pdf') {
      ventana.document.write(`
      <head><title>VISTA PREVIA DOCUMENTO</title></head>
      <body>
        <embed src="${urlDoc}#toolbar=1&navpanes=1&scrollbar=1" style="width:890px;height:690px;"/>
        <a href="${urlDoc}" download="documento.pdf">Descargar</a>
      </body>` );
    } else {
      ventana.document.write(`No fue posible cargar la imagen selecionada.`);
    }
  }

  async validarRevisionCampos() {
    if (this.aproboId.value == '1' && this.aproboPrimerNombre.value == '1' && this.aproboPrimerApellido.value == '1'
      && this.aproboDocId.value == '1' && this.aproboDocCui.value == '1' && this.aproboDocCons.value == '1') {
      this.aproboSolicitud = true;
    } else {
      this.aproboSolicitud = false;
    }
    this.camposAprobadosRechazados =
      'Número ID: ' + (this.aproboId.value == '1' ? 'Aprobado' : 'Rechazado') + ', \n' +
      'Primer Nombre : ' + (this.aproboPrimerNombre.value == '1' ? 'Aprobado' : 'Rechazado') + ', \n' +
      'Primer Apellido : ' + (this.aproboPrimerApellido.value == '1' ? 'Aprobado' : 'Rechazado') + ', \n' +
      'Documento CUI : ' + (this.aproboDocCui.value == '1' ? 'Aprobado' : 'Rechazado') + ', \n' +
      'Documento ID : ' + (this.aproboDocId.value == '1' ? 'Aprobado' : 'Rechazado') + ', \n' +
      'Documento Constancia : ' + (this.aproboDocCons.value == '1' ? 'Aprobado' : 'Rechazado');
    //nombre carpeta
    this.nombreCarpeta = this.nombreSolicitante.replace(' ', '-') + '-' + this.numeroId;
    //fecha fin revision
    this.fechaFinRevisión = moment().format('DD-MM-YYYY');
    //set comentario
    let comentario = null;
    if (!this.aproboSolicitud) {
      const dialogRef = this.dialog.open(DialogComentario, {
        width: '350px',
        data: {}
      });
      dialogRef.disableClose = true;
      comentario = await dialogRef.afterClosed().toPromise();
      this.comentarioEncargado = comentario;
      if (comentario == 'Sin comentario') {
        return false;
      } else {
        return true;
      }
    } else {
      //set nombre carpeta
      return true;
    }
  }

  async enviarDatos() {
    let res = await this.validarRevisionCampos();
    if (res) {
      if (this.taskId != null) {
        let formValues = {
          aproboSolicitud: this.aproboSolicitud,
          comentarioEncargado: this.comentarioEncargado,
          nombreCarpeta: this.nombreCarpeta,
          fechaFinalizo: this.fechaFinRevisión,
          camposAprobadosyRechazados: this.camposAprobadosRechazados,
        }
        console.log(' Se enviara fin rev --> ', formValues);
        let resLogin = await this.alfrescoService.login();
        if (resLogin) {
          let res = await this.alfrescoService.completarTaskForm(formValues, this.taskId.id);
          if (res) {
            alert('AVISO: Revisión realizada correctamente');
            this.finalizoCargaDatos = true;
          } else {
            this.showError();
          }
          this.alfrescoService.logout();
        } else {
          this.showError();
        }
      } else {
        this.showError();
      }
    } else {
      console.log('cancelo finalizar rev');
    }
  }

}

@Component({
  selector: 'dialog-comentario',
  templateUrl: './dialog-comentario.html',
})
export class DialogComentario {
  comentario: string = '';
  cancelo: string = 'Sin comentario';
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComentario>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _ngZone: NgZone) { }

}
