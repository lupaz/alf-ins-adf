import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlfrescoService } from 'app/services/alfresco.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario-revision',
  templateUrl: './formulario-revision.component.html',
  styleUrls: ['./formulario-revision.component.scss']
})
export class FormularioRevisionComponent implements OnInit {

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
  errorRevision:string=null;
  errorRevisionDoc:string=null;

  aproboId:FormControl = new FormControl('',[Validators.required]);
  aproboPrimerNombre:FormControl = new FormControl('',[Validators.required]);
  aproboPrimerApellido:FormControl = new FormControl('',[Validators.required]);
  //Aprobación de documentos
  aproboDocCui:FormControl = new FormControl('',[Validators.required]);
  aproboDocId:FormControl = new FormControl('',[Validators.required]);
  aproboDocCons:FormControl = new FormControl('',[Validators.required]);

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.alfrescoService = new AlfrescoService();
  }

  ngOnInit() {    
    this.route.params.subscribe(params => {
      const applicationId = params['processId'];
      if (applicationId && applicationId !== '0') {
        this.processId = params['processId'];
        //this.validarIdProcess(this.processId);
      }
    });
    
    this.datosPersonalesForm = this.formBuilder.group({
      id: [''],
      cui: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      numTelefono: [''],
      aproboId:this.aproboId,
      aproboPrimerNombre:this.aproboPrimerNombre,
      aproboPrimerApellido:this.aproboPrimerApellido
    });
    this.documentosForm = this.formBuilder.group({
      docCUI: [''],
      docID: [''],
      constancia: [''], 
      aproboDocCui:this.aproboDocCui,
      aproboDocId:this.aproboDocId,
      aproboDocCons:this.aproboDocCons,
    });
  }


  validarCampos(){
    this.errorRevision=null;
    if(!this.aproboId.valid){
      this.errorRevision="Apruebe o rechace el campo de *Número ID*";  
      return;
    }
    if(!this.aproboPrimerNombre.valid){
      this.errorRevision="Apruebe o rechace el campo *Primer Nombre*";  
      return;
    }
    if(!this.aproboPrimerApellido.valid){
      this.errorRevision="Apruebe o rechace el campo *Primer Apellido*";  
      return;
    }
  }

  validarCamposDoc(){
    this.errorRevisionDoc=null;
    if(!this.aproboDocCui.valid){
      this.errorRevisionDoc="Apruebe o rechace el campo *Documento CUI*";  
      return;
    }    
    if(!this.aproboDocId.valid){
      this.errorRevisionDoc="Apruebe o rechace el campo *Documento ID*";  
      return;
    }    
    if(!this.aproboDocCons.valid){
      this.errorRevisionDoc="Apruebe o rechace el campo *Doc Constancia*";  
      return;
    }
  }
}
