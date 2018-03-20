import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocalService } from '../../storage/local.service';
import { environment } from '../../../environments/environment';
@Injectable()
export class MembersService {

  	constructor(public http : Http, private localService : LocalService) { }
  	/**
  	 * @method addMember
  	 * creates a new form field resource
  	 * @return data
  	 */
  	addMember(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/create-member',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json());
  	}

     /**
     * @method uploadMember
     * creates a new form field resource
     * @return data
     */
    uploadMember(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member/upload-member/'+JSON.parse(this.localService.getVendor()).id, JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json());
    }
    
  	/**
  	 * @method getMember
  	 * get form field resource
  	 * @return data
  	 */
  	getMember()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/coop-members/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json());
  	}
 
  	/**
  	 * @method deleteMember
  	 * delete form field resource
  	 * @return data
  	 */
  	deleteMember(id)
  	{
  		return this.http.delete(environment.api.url+'CoopManagement/delete-staff-position/'+id, this.localService.header())
  						.map((response : Response) => response.json());
  	}
  	/**

  	/**
  	 * @method updateMember
  	 * updates a sform field  resource
  	 * @return data
  	 */
 	  updateMember(data, id)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/update-member-profile/'+JSON.parse(this.localService.getVendor()).id+'/'+id,JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json());
  	}

    /**
     * @method activateAllMember
     * activate  all coorp member resource
     * @return data
     */
     activateAllMember()
    {
      return this.http.get(environment.api.url+'CoopManagement/activate-all-coop-member/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method activateMember
     * activate  a member resource
     * @return data
     */
     activateMember(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/activate-coop-member/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }

    /**
     * @method deactivateMember
     * activate  a member resource
     * @return data
     */
     deactivateMember(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/deactivate-coop-member/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }

     /**
     * @method deactivateAllMember
     * activate  all coorp member resource
     * @return data
     */
     deactivateAllMember()
    {
      return this.http.get(environment.api.url+'CoopManagement/deactivate-all-coop-member/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json());
    }

    /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    getFormField()
    {
      return this.http.get(environment.api.url+'form/get-custom-field/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method getMemberProfile
     * get a member profile
     * @return data
     */
    getMemberProfile(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/get-member-profile/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }

    /**
     * @method updateBankAcountRequest
     * sends a request mail to the member to update bank details
     * @return data
     */
    updateBankAcountRequest(id)
    {
      return this.http.get(environment.api.url+'member/request-update-bank-details/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }

     /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    resetPassword(data)
    {
      return this.http.post(environment.api.url+'reset-password',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json());
    }

     /**
     * @method getFormField
     * get form field resource
     * @return data
     */
    changePassword(data)
    {
      return this.http.post(environment.api.url+'member/change-password', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method getMemberLoanRequest
     * get all member loan request
     * @return data
     */
    getMemberLoanRequest(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-request/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method getContributions
     * get all member contributions
     * @return data
     */
    getMemberContributions(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/contributions/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method getDeductions
     * get all member deductions
     * @return data
     */
    getMemberDeductions(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json());
    }

     /**
     * @method filterMembers
data   * get all member deductions
     * @return data
     */
    filterMembers(data)
    {
      return this.http.get(environment.api.url+'CoopManagement/members/'+JSON.parse(this.localService.getVendor()).id+'/'+data, this.localService.header())
              .map((response : Response) => response.json());
    }

    /**
     * @method queryMember
     * activate  all coorp member resource
     * @return data
     */
     queryMember(query)
    {
      return this.http.get(environment.api.url+'CoopManagement/members/query/'+JSON.parse(this.localService.getVendor()).id+'/'+query, this.localService.header())
              .map((response : Response) => response.json());
    }
}
