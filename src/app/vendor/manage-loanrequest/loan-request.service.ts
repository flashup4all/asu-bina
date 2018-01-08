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
export class LoanRequestService {

  	constructor(public http : Http, private localService : LocalService) { }
  	/*loan request*/

    /**
     * @method cancelLoanRequest
     * cancel loan request
     * @return data
     */
      cancelLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/cancel-loan-request/'+
                    JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    } 

    /**
     * @method deleteLoanRequest
     * delete loan request
     * @return data
     */
      deleteLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/delete-loan-request/'+
                    JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    } 

    /**
     * @method getLoanRequest
     * get all vendor loan request
     * @return data
     */
      getLoanRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method getAllLoanRequest
     * get all vendor loan request
     * @return data
     */
      getAllLoanRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/all-loan-request/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }  

    /**
     * @method getSingleLoanRequest
     * get all vendor loan request
     * @return data
     */
      getSingleLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    } 
    /**
     * @method approveLoanRequest
     * approve loan request
     * @return data
     */
      approveLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/approve-loan-request/'+
                    JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method addLoanRequest
     * get member deductions
     * @return data
     */
      addLoanRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/new-loan-request',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }
}
