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

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	/*loan request*/

    /**
     * @method cancelLoanRequest
     * cancel loan request
     * @return data
     */
      cancelLoanRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/cancel-loan-request', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method close_loan_request
     * close active loan request
     * @return data
     */
    close_loan_request(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/loan-request/close-loan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
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
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    } 

    /**
     * @method getLoanRequest
     * get all vendor loan request
     * @return data
     */
      getLoanRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getLoanRequestApprovals
     * get all vendor loan request
     * @return data
     */
      getLoanRequestApprovals(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/get-loan-request-approvals/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method get_loan_deductions
     * get all vendor loan request
     * @return data
     */
      get_loan_deductions(id)
    {
        return this.http.get(environment.api.url +'CoopManagement/deductions/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getAllLoanRequest
     * get all vendor loan request
     * @return data
     */
      getAllLoanRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/all-loan-request/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }  

    /**
     * @method getSingleLoanRequest
     * get all vendor loan request
     * @return data
     */
      getSingleLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    } 
    /**
     * @method approveLoanRequest
     * approve loan request
     * @return data
     */
      approveLoanRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/approve-loan-request', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addLoanRequest
     * get member deductions
     * @return data
     */
      addLoanRequest(data)
    {
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
      return this.http.post(environment.api.url+'CoopManagement/new-loan-request',data, request)
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addLoanRequest
     * get member deductions
     * @return data
     */
      upload_loan_request_requirements(data, request_id)
    {
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
      return this.http.post(environment.api.url+'CoopManagement/upload-loan-request-requirements/'+request_id,data, request)
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method delete_loan_request_requirement
     * get all vendor loan request
     * @return data
     */
    delete_loan_request_requirement(id)
    {
      return this.http.delete(environment.api.url+'CoopManagement/loan-request-requirements/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }


    /**
     * @method filterLoanRequest
     * filter loan request
     * @return data
     */
      filterLoanRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/loan-request/filter',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method advance_filterLoanRequest
     * filter loan request
     * @return data
     */
    advance_filterLoanRequest(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/loan-request/advance-filter',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
