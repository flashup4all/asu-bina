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

}
