import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlfrescoService } from 'app/services/alfresco.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-constancia',
  templateUrl: './constancia.component.html',
  styleUrls: ['./constancia.component.scss']
})
export class ConstanciaComponent implements OnInit {

  idDoc: any;
  alfrescoService: AlfrescoService;
  urlDoc:any;
  constructor(private route: ActivatedRoute,private sanitizer: DomSanitizer) {
    this.alfrescoService = new AlfrescoService();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const applicationId = params['idDoc'];
      if (applicationId && applicationId !== '0') {
        this.idDoc = params['idDoc'];
        this.generarLink();
      }
    });
  }

  async generarLink() {
    await this.alfrescoService.login();
    //4009 es imagen
    let blob = await this.alfrescoService.recuperArchivo(this.idDoc);
    await this.alfrescoService.logout();
    console.log('tipo -->', blob);
    this.urlDoc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

}
