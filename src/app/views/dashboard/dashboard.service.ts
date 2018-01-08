import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { LocalService } from '../../../storage/local.service';

import { environment } from '../../../../environments/environment';

@Injectable()
export class DashboardService {

  	constructor(public http : Http, private localService : LocalService) { }
  	/**
  	 * @method addMember
  	 * creates a new form field resource
  	 * @return data
  	 */
  	addMember(data)
  	{
  		return this.http.post(environment.api.url+'form/add-custom-field',JSON.stringify(data), this.localService.header())
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
  		return this.http.post(environment.api.url+'CoopManagement/update-staff/'+id,JSON.stringify(data), this.localService.header())
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
     * @method getContributions
     * get all vendor loan request
     * @return data
     */
      getContributions()
    {
      return this.http.get(environment.api.url+'CoopManagement/contributions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json());
    }

    /**
     * @method getDeductions
     * get all vendor loan request
     * @return data
     */
      getDeductions()
    {
      return this.http.get(environment.api.url+'CoopManagement/deductions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method runDeductions
     * get form field resource
     * @return data
     */
    runDeductions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-deductions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method runContributions
     * get form field resource
     * @return data
     */
    runContributions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-contributions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json());
    }
    /**
     * @method getVendorStatistics
     * get vendor statistics
     * @return data
     */
    getVendorStatistics()
    {
      return this.http.get(environment.api.url+'CoopManagement/coorp-stat/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
                      .map((response : Response) => response.json());
      }

    /*widthdrawals*/
     /**
     * @method getWidthdrawals
     * get member widthdrawals
     * @return data
     */
    getWidthdrawals()
    {
      return this.http.get(environment.api.url+'CoopManagement/widthdrawal/get/'+
                    JSON.parse(this.localService.getVendor()).id+ this.localService.header())
              .map((response : Response) => response.json());
    }
}
