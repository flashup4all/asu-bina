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
export class StaffService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	/**
  	 * @method addStaffPosition
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	addStaffPosition(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/staff-position',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
    /**
     * @method updateStaffPosition
     * creates a update staff position resource
     * @return data
     */
    updateStaffPosition(data, id)
    {
      return this.http.post(environment.api.url+'CoopManagement/staff-position/'+id,JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    deactivate_staff(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/staff/staff-deactivate/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    activate_staff(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/staff/staff-activate/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
  	/**
  	 * @method getStaffPosition
  	 * get staff position resource
  	 * @return data
  	 */
  	getStaffPosition()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/staff-position/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method deleteStaffPosition
  	 * delete staff position resource
  	 * @return data
  	 */
  	deleteStaffPosition(id)
  	{
  		return this.http.delete(environment.api.url+'CoopManagement/delete-staff-position/'+id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method addStaff
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	addStaff(data)
  	{
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
  		return this.http.post(environment.api.url+'CoopManagement/create-staff',data, request)
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

  	/**
  	 * @method updateStaff
  	 * updates a staff  resource
  	 * @return data
  	 */
  	updateStaff(data, id)
  	{
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
  		return this.http.post(environment.api.url+'CoopManagement/update-staff/'+id, data, request)
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

  	/**
  	 * @method getStaff
  	 * get staff resource
  	 * @return data
  	 */
  	getStaff()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/staff/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response: Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
    /**
     * @method getStaff
     * get staff resource
     * @return data
     */
    get_single_staff(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/get-single-staff/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response: Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
  	/**
  	 * @method getUserRoles
  	 * get user roles resource
  	 * @return data
  	 */
  	getUserRoles()
  	{
  		return this.http.get(environment.api.url+'user/roles', this.localService.header())
  						.map((response: Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method deleteStaff
  	 * get staff resource
  	 * @return data
  	 */
  	deleteStaff(id)
  	{
  		return this.http.delete(environment.api.url+'CoopManagement/delete-staff/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
  						.map((response: Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

     /**
     * @method filterStaff
     * get all member deductions
     * @return data
     */
    filterStaff(data)
    {
      return this.http.get(environment.api.url+'CoopManagement/staff/'+JSON.parse(this.localService.getVendor()).id+'/'+data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
