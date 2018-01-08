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
export class WidthdrawalsService {

  	constructor(public http : Http, private localService : LocalService) { }
  	
  	/**
     * @method getWidthdrawals
     * get member widthdrawals
     * @return data
     */
    getWidthdrawals()
    {
      return this.http.get(environment.api.url+'CoopManagement/widthdrawal/get/'+
                    JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method approveWidthdrawalRequest
     * update widrawal request
     * @return data
     */
    approveWidthdrawalRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/widthdrawal/approve',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }
    /**
     * @method cancelWidthdrawalRequest
     * update widrawal request
     * @return data
     */
    cancelWidthdrawalRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/widthdrawal/cancel',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }
}
