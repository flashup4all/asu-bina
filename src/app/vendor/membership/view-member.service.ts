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
export class ViewMemberService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	/**
  	 * @method addMember
  	 * creates a new form field resource
  	 * @return data
  	 */
  	addMember(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/create-member',JSON.stringify(data), this.localService.header())
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
  		return this.http.post(environment.api.url+'CoopManagement/update-staff/'+id,JSON.stringify(data), this.localService.header())
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
     * @method getFormField
     * get form field resource
     * @return data
     */
    resetPassword(id)
    {
      return this.http.get(environment.api.url+'form/get-custom-field/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    changePassword(data, id)
    {
      return this.http.post(environment.api.url+'user/change-password/'+id, JSON.stringify(data), this.localService.header())
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

}
