import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
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

  	constructor(public http : Http, private localService : LocalService, public router: Router, public handleErr : handleErrors) { }
  	
  	/**
     * @method getDeductions
     * get all vendor loan request
     * @return data
     */
      getDeductions()
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)}/*(error) => {
      if (error.status === 401) {
      window.localStorage.clear()
        this.router.navigate(['/auth']); 
       // return Observable.throw(error);
    } else {
        return Observable.throw(error);
    }
}*/);
    }
    /**
     * @method runDeductions
     * get form field resource
     * @return data
     */
    runDeductions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-deductions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method runEditedDeductions
     * get form field resource
     * @return data
     */
    runEditedDeductions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-edited-deductions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method filterDeduction
     * filter contribution
     * @return data
     */
    filterDeduction(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/deductions/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method repayment
     * filter contribution
     * @return data
     */
    repayment(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/deductions/make-a-repayment', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addrepaymentType
     * filter contribution
     * @return data
     */
    addRepaymentType(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/deductions-repaymeen-types/create', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getrepayment_type
     * filter contribution
     * @return data
     */
    get_repayment_type()
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions-repaymeen-types/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getContribution_type
     * filter contribution
     * @return data
     */
    delete_repayment_type(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions-repaymeen-types/delete/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

}
