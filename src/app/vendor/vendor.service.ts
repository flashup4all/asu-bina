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

  	constructor(public http : Http, private localService : LocalService) { }

  	/**
  	 * @method updateVendor
  	 * updates a LoanSignatory  resource
  	 * @return data
  	 */
  	updateVendor(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/update',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch(handleErrors);
  	}

    /**
     * @method updatePassword
     * updates a LoanSignatory  resource
     * @return data
     */
    updatePassword(data)
    {
      return this.http.post(environment.api.url+'users/update-password',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method addBankAccount
     * updates a LoanSignatory  resource
     * @return data
     */
    addBankAccount(data)
    {
      return this.http.post(environment.api.url+'vendor-bank',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

     /**
     * @method getBankAccount
     * updates a LoanSignatory  resource
     * @return data
     */
    getBankAccount()
    {
      return this.http.get(environment.api.url+'vendor-bank/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

     /**
     * @method getBankList
     * updates a LoanSignatory  resource
     * @return data
     */
    getBankList()
    {
      return this.http.post('https://moneywave.herokuapp.com/banks', this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

}
