import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { LocalService } from '../storage/local.service';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  private headers = new Headers({ 'Content-Type': 'application/json'});
	private url = environment.api.url;
	private token;
	constructor(public http : Http, private localService : LocalService) { }

	/**
	 * @method authenticate
	 * authenticates a staff
	 * @return token
	 */
	authenticate(data)
	{
		return this.http.post(this.url+'auth/vlogin', JSON.stringify(data), this.localService.header())
            /*.map((response: Response) => response.json());*/
             .toPromise()
             .then((response) => {
               return response.json();
             })
             .catch(this.handleErrors);
	}
	/**
	 * @method errorHandler
	 * manages signin errors
	 * return error response
	 */
	private handleErrors(error: Response){
	    switch(error.status){
	        case 500:
	        return Observable.throw("Internal Server Error")
	        case 404:
	        return Observable.throw(error.json().message);
	        default:
	        return Observable.throw("We could not login you in at the moment. Check supplied details.");
	    }
   	}


}
