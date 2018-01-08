import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { LocalService } from '../../storage/local.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class FormService {

  	constructor(public http : Http, private localService : LocalService) { }
  /**
  	 * @method addFormField
  	 * creates a new form field resource
  	 * @return data
  	 */
  	addFormField(data)
  	{
  		return this.http.post(environment.api.url+'form/add-custom-field',JSON.stringify(data), this.localService.header())
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
  	 * @method deleteFormField
  	 * delete form field resource
  	 * @return data
  	 */
  	deleteFormField(id)
  	{
  		return this.http.delete(environment.api.url+'form/delete-custom-field/'+id, this.localService.header())
  						.map((response : Response) => response.json());
  	}
  	/**

  	/**
  	 * @method updateFormField
  	 * updates a sform field  resource
  	 * @return data
  	 */
 	updateFormField(data, id)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/update-staff/'+id,JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json());
  	}


}
