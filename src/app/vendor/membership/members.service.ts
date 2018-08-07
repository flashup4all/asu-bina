import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalService } from '../../storage/local.service';
import { environment } from '../../../environments/environment';
import {
    handleErrors
} from '../../shared/helpers/index';
@Injectable()
export class MembersService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	/**
  	 * @method addMember
  	 * creates a new form field resource
  	 * @return data
  	 */
  	addMember(data)
  	{
       let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
  		return this.http.post(environment.api.url+'CoopManagement/create-member',data, request)
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

     /**
     * @method uploadMember
     * creates a new form field resource
     * @return data
     */
    uploadMember(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member/upload-member/'+JSON.parse(this.localService.getVendor()).id, JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    
  	/**
  	 * @method getMember
  	 * get form field resource
  	 * @return data
  	 */
  	getMember()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/coop-members/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
    /**
     * @method getMember
     * get form field resource
     * @return data
     */
    filter_member(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
 
  	/**
  	 * @method deleteMember
  	 * delete form field resource
  	 * @return data
  	 */
  	deleteMember(id)
  	{
  		return this.http.delete(environment.api.url+'CoopManagement/delete-staff-position/'+id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**

  	/**
  	 * @method updateMember
  	 * updates a sform field  resource
  	 * @return data
  	 */
 	  updateMember(data, id)
  	{
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
  		return this.http.post(environment.api.url+'CoopManagement/update-member-profile/'+JSON.parse(this.localService.getVendor()).id+'/'+id, data, request)
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

    /**
     * @method activateAllMember
     * activate  all coorp member resource
     * @return data
     */
     activateAllMember()
    {
      return this.http.get(environment.api.url+'CoopManagement/activate-all-coop-member/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method activateMember
     * activate  a member resource
     * @return data
     */
     activateMember(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/activate-coop-member/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method deactivateMember
     * activate  a member resource
     * @return data
     */
     deactivateMember(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/deactivate-coop-member/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method deactivateAllMember
     * activate  all coorp member resource
     * @return data
     */
     deactivateAllMember()
    {
      return this.http.get(environment.api.url+'CoopManagement/deactivate-all-coop-member/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    getFormField()
    {
      return this.http.get(environment.api.url+'form/get-custom-field/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getMemberProfile
     * get a member profile
     * @return data
     */
    getMemberProfile(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/get-member-profile/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method updateBankAcountRequest
     * sends a request mail to the member to update bank details
     * @return data
     */
    updateBankAcountRequest(id)
    {
      return this.http.get(environment.api.url+'member/request-update-bank-details/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    resetPassword(data)
    {
      return this.http.post(environment.api.url+'reset-password',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    changePassword(data)
    {
      return this.http.post(environment.api.url+'member/change-password', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getMemberLoanRequest
     * get all member loan request
     * @return data
     */
    getMemberLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getMemberLoanRequest
     * get all member loan request
     * @return data
     */
    getMemberActiveLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request-active/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getContributions
     * get all member contributions
     * @return data
     */
    getMemberContributions(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/contributions/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getDeductions
     * get all member deductions
     * @return data
     */
    getMemberDeductions(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method filterMembers
data   * get all member deductions
     * @return data
     */
    filterMembers(data)
    {
      return this.http.get(environment.api.url+'CoopManagement/members/'+JSON.parse(this.localService.getVendor()).id+'/'+data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method queryMember
     * activate  all coorp member resource
     * @return data
     */
     queryMember(query)
    {
      return this.http.get(environment.api.url+'CoopManagement/members/query/'+JSON.parse(this.localService.getVendor()).id+'/'+query, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
