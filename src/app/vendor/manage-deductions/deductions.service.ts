import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
    handleErrors
} from '../../shared/helpers/index';

import { LocalService } from '../../storage/local.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class DeductionsService {

  	constructor(public http : Http, private localService : LocalService) { }
  	
  	/**
     * @method getDeductions
     * get all vendor loan request
     * @return data
     */
      getDeductions()
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }
    /**
     * @method runDeductions
     * get form field resource
     * @return data
     */
    runDeductions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-deductions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method runEditedDeductions
     * get form field resource
     * @return data
     */
    runEditedDeductions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-edited-deductions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

}
