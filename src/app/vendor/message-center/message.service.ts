import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { LocalService } from '../../storage/local.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class MessageService {

  	constructor(public http : Http, private localService : LocalService) { }
  	/**
  	 * @method postMessage
  	 * update settings resource
  	 * @return data
  	 */
  	postMessage(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/message-center',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json());
  	}

    /**
     * @method getVendorMessage
     * get vendor resource
     * @return data
     */
    getVendorMessage(status)
    {
      return this.http.get(environment.api.url+'CoopManagement/message-center/'+
                            JSON.parse(this.localService.getVendor()).id+'/'
                            +JSON.parse(this.localService.getUser()).id+'/'+status, this.localService.header())
              .map((response : Response) => response.json());
    }

}
