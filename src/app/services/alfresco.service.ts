import { Injectable } from '@angular/core';
import {
  SaveFormRepresentation, CompleteFormRepresentation,
  ResultListDataRepresentationTaskRepresentation,
  HistoricProcessInstanceQueryRepresentation, HistoricTaskInstanceQueryRepresentation,
  ProcessInstancesApi, ResultListDataRepresentationProcessInstanceRepresentation,
  AlfrescoApi,
  TasksApi, QueryVariable,
  UserProfileApi, UserRepresentation,
  ProcessInstanceVariablesApi,
  TaskActionsApi,
  AlfrescoApiClient,
  RelatedContentRepresentation,
  TaskRepresentation,
  TaskQueryRepresentation,
  TaskVariablesApi,
  TaskFormsApi,
  ContentApi
} from '@alfresco/js-api'

import { AlfrescoApiService, formModelTabs } from '@alfresco/adf-core';

@Injectable({
  providedIn: 'root'
})
export class AlfrescoService {

  private alfrescoApi: AlfrescoApi;
  //los clientes consultan directamente el API correpondiente por medio del metodo callApi();
  private apiProcessClient: AlfrescoApiClient; //util para consultar de forma directa el API de alfresco ACS
  private apiContentClient: AlfrescoApiClient; //util para consultar de forma directa el API de alfresco APS
  //Abtracciones de las partes del API de APS
  private processInstancesApi: ProcessInstancesApi;
  private tasksApi: TasksApi;
  private taskFormApi: TaskFormsApi;
  private contentApi: ContentApi;

  constructor() {
    this.alfrescoApi = new AlfrescoApi({ provider: 'BPM', hostBpm: 'http://35.192.73.25:9090' });
    if (this.alfrescoApi) {
      this.apiProcessClient = this.alfrescoApi.processClient;
      this.apiContentClient = this.alfrescoApi.contentClient;
      this.processInstancesApi = new ProcessInstancesApi(this.alfrescoApi);
      this.tasksApi = new TasksApi(this.alfrescoApi);
      this.taskFormApi = new TaskFormsApi(this.alfrescoApi);
      this.contentApi = new ContentApi(this.alfrescoApi);
    }
  }

  async iniciarSolicitud() {
    await this.login();

    await this.iniciarProceso();

    await this.logout();

  }

  login() {
    return this.alfrescoApi.login('admin@app.activiti.com', 'admin').then(
      data => {
        console.log('API called successfully Login in  BPM and ECM performed ', data);
        return true;
      },
      error => {
        console.error(error);
        return null;
      }
    );
  }

  logout() {
    return this.alfrescoApi.logout().then(
      data => {
        console.log('Successfully Logout');
      },
      error => {
        console.error('Possible ticket already expired');
      }
    );
  }

  iniciarProceso() {

    return this.processInstancesApi.startNewProcessInstance({
      name: "inscripcion", processDefinitionId: "Process_sid-59A6B02B-2AC6-421D-B662-E5B1549EC40C:23:32611"
    }).then((res2) => {
      console.log('proceso iniciado -----> ', res2);
      return res2.id;
    }, function (error) {
      console.error(error);
      return null;
    });


  }

  recuperarTareaActual(processInstaceId: string) {
    //Construimos el req para recupear la primera tarea activa de la instancia del proceso indicada
    let tasksQuery = {
      processInstanceId: processInstaceId,
      sort: "created-desc",
      state: "active"
    }

    return this.tasksApi.listTasks(tasksQuery).then((data) => {
      console.log('API called successfully. Returned data: ', data);
      if(data.data.length>0){
        return {
          id: data.data[0].id,
          nombre: data.data[0].name
        }
      }else{
        return null;
      }
      
    }, function (error) {
      console.error('Process instance not found for id ',tasksQuery.processInstanceId);
      return null;
    });


  }

  completarTaskForm(formValues, taskId) {
    let reqForm = {
      values: formValues,
    }

    return this.taskFormApi.completeTaskForm(taskId, reqForm).then(() => {
      console.log('API called successfully.');
      return true;
    }, function (error) {
      console.error(error);
      return null;
    });
  }

  recuperarTaskForm(taskId) {

  }

  subirArchivoAlProceso(processInstanceId: string, relatedContent: RelatedContentRepresentation | any) {
    console.log(' Inicia la subida del documento -->',relatedContent);
    let opts = {
      'isRelatedContent': false,
    };

    let pathParams = {
      'processInstanceId': processInstanceId
    };

    let queryParams = {
      'isRelatedContent': opts['isRelatedContent']
    };

    let headerParams = {};
    let formParams = {};
    let accepts = ['application/json'];

    let postBody = null;
    formParams = {
      'file': relatedContent
    };
    let contentTypes = ['multipart/form-data'];
    return this.apiProcessClient.callApi(
      '/api/enterprise/process-instances/{processInstanceId}/raw-content', 'POST',
      pathParams, queryParams, headerParams, formParams, postBody,
      contentTypes, accepts, RelatedContentRepresentation).then((data:RelatedContentRepresentation) => {
        console.log('API Upoad Doc... called successfully. Returned data: ' + data);
        return data.id;
      }, function (error) {
        console.error(error);
        return null;
      });;
  }

}
