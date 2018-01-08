import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
    handleErrors
} from '../../../shared/helpers/index';

import { LocalService } from '../../../storage/local.service';

import { environment } from '../../../../environments/environment';

@Injectable()
export class SettingsService {

  	constructor(public http : Http, private localService : LocalService) { }
  	/**
  	 * @method editSettings
  	 * update settings resource
  	 * @return data
  	 */
  	updateSettings(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/settings/update',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch(handleErrors);
  	}
  	/**
  	 * @method getSettings
  	 * get settings resource
  	 * @return data
  	 */
  	getSettings()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/settings/get/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch(handleErrors);
  	}

}
