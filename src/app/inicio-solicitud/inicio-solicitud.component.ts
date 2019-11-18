import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AlfrescoService } from '../services/alfresco.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
import { MatDialog } from '@angular/material';
import { from } from 'rxjs';

@Component({
  selector: 'app-inicio-solicitud',
  templateUrl: './inicio-solicitud.component.html',
  styleUrls: ['./inicio-solicitud.component.scss']
})
export class InicioSolicitudComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
  alfrecoService: AlfrescoService;
  inicioSolicitudValido: boolean = false;
  constructor(public dialog: MatDialog) {
    this.alfrecoService = new AlfrescoService();
  }

  ngOnInit() {
  }

  async iniciarSolicitud() {
    console.log('Se inicia el proceso de inscripción con el correo --> ', this.emailFormControl.value);
    //this.alfrecoService.iniciarSolicitud();
    await this.alfrecoService.login();

    let processId = await this.alfrecoService.iniciarProceso();

    if (processId != null) {
      let taskId = await this.alfrecoService.recuperarTareaActual(processId);
      if (taskId != null) {
        console.log('tarea recuperada - >', taskId);
        let fomValues = {
          correoElectronico: this.emailFormControl.value
        }
        let res = await this.alfrecoService.completarTaskForm(fomValues, taskId.id);
        if (res) {
          alert('AVISO: Solicitud Iniciada');
          this.inicioSolicitudValido = true;
        } else {
          alert('ERROR: No se pudo iniciar su solicitud, intenelo de nuevo más tarde.');
        }
        
      } else {
        alert('ERROR: No se pudo iniciar su solicitud, intenelo de nuevo más tarde.');
      }
    }else{
      alert('ERROR: No se pudo iniciar su solicitud, intenelo de nuevo más tarde.');
    }
    await this.alfrecoService.logout();
  }

}
