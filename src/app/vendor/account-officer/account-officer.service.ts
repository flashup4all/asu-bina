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
export class AccountOfficerService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }

     /**
     * @method assign_account
     * creates a new form field resource
     * @return data
     */
    assign_account(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/account-officer/create', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method delete_account_officer
     * creates a new form field resource
     * @return data
     */
    delete_account_officer(id)
    {
      return this.http.delete(environment.api.url+'CoopManagement/account-officer/delete/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method assign_account
     * creates a new account officer resource
     * @return data
     */
    set_default(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/account-officer/set-default', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_member
     * creates a new account officer resource
     * @return data
     */
    get_member(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/account-officer/member/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method get_staff
     * creates a new account officer resource
     * @return data
     */
    get_staff(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/account-officer/staff/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}