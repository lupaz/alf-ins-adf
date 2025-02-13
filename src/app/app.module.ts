import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';


// ADF modules
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { CoreModule, TRANSLATION_PROVIDER, TranslateLoaderService } from '@alfresco/adf-core';

// Custom stencils
import { StencilsModule } from './stencils.module';

//Material
import { MaterialModule } from './material-module';

// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppsComponent } from './apps/apps.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { FileViewComponent } from './file-view/file-view.component';
import { BlobViewComponent } from './file-view/blob-view.component';
import { PreviewService } from './services/preview.service';

import { appRoutes } from './app.routes';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { InicioSolicitudComponent } from './inicio-solicitud/inicio-solicitud.component';
import { FormularioRegistroComponent } from './formulario-registro/formulario-registro.component';
import { InformacionEstudianteComponent } from './informacion-estudiante/informacion-estudiante.component';
import { DocumentosEstudianteComponent } from './documentos-estudiante/documentos-estudiante.component';
import { ContenedorGeneralComponent } from './contenedor-general/contenedor-general.component';
import { FormularioRevisionComponent } from './formulario-revision/formulario-revision.component';
import { DialogComentario } from './formulario-revision/formulario-revision.component';
import { ConstanciaComponent } from './constancia/constancia.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule.forRoot(
            appRoutes // ,
            // { enableTracing: true } // <-- debugging purposes only
        ),

        // ADF modules
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        ProcessModule.forRoot(),
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
        }),
        StencilsModule
    ],
    declarations: [
        AppComponent,
        AppsComponent,
        HomeComponent,
        LoginComponent,
        TasksComponent,
        TaskDetailsComponent,
        StartProcessComponent,
        AppLayoutComponent,
        BlobViewComponent,
        FileViewComponent,
        InicioSolicitudComponent,
        FormularioRegistroComponent,
        InformacionEstudianteComponent,
        DocumentosEstudianteComponent,
        ContenedorGeneralComponent,
        FormularioRevisionComponent,
        DialogComentario,
        ConstanciaComponent
    ],
    providers: [
        PreviewService,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        }
    ],
    entryComponents: [
        DialogComentario
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
