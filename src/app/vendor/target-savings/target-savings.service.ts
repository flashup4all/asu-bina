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
export class TargetSavingsService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	

  	/**
     * @method createTargerSavings
     * get vendor target savings
     * @return data
     */
    createTargerSavings(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/target-savings/create', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
  	/**
     * @method getVendorTargetSavings
     * get vendor target savings
     * @return data
     */
    getVendorTargetSavings()
    {
      return this.http.get(environment.api.url+'CoopManagement/target-savings/vendor/'+
                    JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getMemberTargetSavings
     * get member target savings
     * @return data
     */
    getMemberTargetSavings(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/target-savings/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getMemberTargetSavings
     * get member target savings
     * @return data
     */
    filterTargetSavings(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/target-savings/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }


}
