import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
    handleErrors
} from '../shared/helpers/index';
import { LocalService } from '../storage/local.service';

import { environment } from '../../environments/environment';

@Injectable()
export class VendorService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }

  	/**
  	 * @method updateVendor
  	 * updates a LoanSignatory  resource
  	 * @return data
  	 */
  	updateVendor(data)
  	{
      let headers = new Headers();
            //headers.append('content-type', 'application/json');
            headers.set('Accept', 'application/json');
        let token = this.localService.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
  		return this.http.post(environment.api.url+'CoopManagement/update',data, request)
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

    /**
     * @method updatePassword
     * updates a LoanSignatory  resource
     * @return data
     */
    updatePassword(data)
    {
      return this.http.post(environment.api.url+'users/update-password',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addBankAccount
     * updates a BankAccount  resource
     * @return data
     */
    addBankAccount(data)
    {
      return this.http.post(environment.api.url+'vendor-bank',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method updateBankAccount
     * updates a BankAccount  resource
     * @return data
     */
    updateBankAccount(data)
    {
      return this.http.post(environment.api.url+'vendor-bank/update',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method getBankAccount
     * updates a BankAccount  resource
     * @return data
     */
    getBankAccount()
    {
      return this.http.get(environment.api.url+'vendor-bank/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method deleteBankAccount
     * updates a BankAccount  resource
     * @return data
     */
    deleteBankAccount(id)
    {
      return this.http.get(environment.api.url+'vendor-bank/delete/'+JSON.parse(this.localService.getVendor()).id+'/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     

    /*money wave*/

    /**
     * @method getBankList
     * updates a LoanSignatory  resource
     * @return data
     */
    getBankList()
    {
      return this.http.post('https://moneywave.herokuapp.com/banks', this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    auth_money_wave()
    {
      let data = {

      };
      return this.http.post('https://moneywave.herokuapp.com/v1/merchant/verify', JSON.stringify(environment.api.payment_key), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /*sms-settings*/
    /**
     * @method update_sms_settings
     * updates a sms settings  resource
     * @return data
     */
    update_sms_settings(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/sms-settings',data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method update_birthday_sms_settings
     * updates a sms settings  resource
     * @return data
     */
    update_birthday_sms_settings(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/birthday-sms-settings',data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method update_welcome_sms_settings
     * updates a welcome sms settings  resource
     * @return data
     */
    update_welcome_sms_settings(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/sms-settings/welcome-sms-settings',data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method send_bulk_notification
     * send bulk notification
     * @return data
     */
    send_bulk_notification(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/sms-settings/send-bulk-notification',data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method send_bulk_
     * send bulk sms
     * @return data
     */
    send_bulk_sms(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/sms-settings/send-bulk-sms',data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method get_sms_settings
     * updates a sms settings  resource
     * @return data
     */
    get_sms_settings()
    {
      return this.http.get(environment.api.url+'CoopManagement/sms-settings/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_sms_messages
     * updates a sms settings  resource
     * @return data
     */
    get_sms_messages()
    {
      return this.http.post(environment.api.url+'CoopManagement/sms-notifications/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_vendor_sms_history
     * get vendor sms history resource
     * @return data
     */
    get_vendor_sms_history()
    {
      return this.http.get(environment.api.url+'CoopManagement/sms-settings/sms-history/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_vendor_logs
     * updates a sms settings  resource
     * @return data
     */
    get_vendor_logs()
    {
      return this.http.get(environment.api.url+'CoopManagement/vendor-logs/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method filter_vendor_logs
     * updates a sms settings  resource
     * @return data
     */
    filter_vendor_logs(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/vendor-logs/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /* branches services */

    /**
     * @method addVendorBranches
     * updates a updateVendorBranches  resource
     * @return data
     */
    addVendorBranches(data)
    {
      return this.http.post(environment.api.url+'vendor-branch',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method updateBankAccount
     * updates a updateVendorBranches  resource
     * @return data
     */
    updateVendorBranches(data)
    {
      return this.http.post(environment.api.url+'vendor-branch/update',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method getVendorBranches
     * updates a getVendorBranches  resource
     * @return data
     */
    getVendorBranches()
    {
      return this.http.get(environment.api.url+'vendor-branch/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method deleteVendorBranches
     * updates a deleteVendorBranches  resource
     * @return data
     */
    deleteVendorBranches(data)
    {
      return this.http.post(environment.api.url+'vendor-branch/delete', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /*sms subscriptions api calls*/

     /**
     * @method get_vendor_subscriptions
     * get vendor sms subscriptions
     * @return data
     */
    get_vendor_subscriptions()
    {
      return this.http.get(environment.api.url+'CoopManagement/sms-subscription/vendor/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
