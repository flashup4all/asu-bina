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
     * @method send_notification
     * updates a sms settings  resource
     * @return data
     */
    send_notification(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/send-notification',data, this.localService.header())
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
      return this.http.post(environment.api.url+'CoopManagement/sms-notifications/',JSON.parse(this.localService.getVendor()).id, this.localService.header())
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
}
