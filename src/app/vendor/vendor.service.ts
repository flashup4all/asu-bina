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
  		return this.http.post(environment.api.url+'CoopManagement/update',JSON.stringify(data), this.localService.header())
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
}
