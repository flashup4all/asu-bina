import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from '../../environments/environment';

@Injectable()
export class LocalService {

	constructor(public http : Http, private toastrService : ToastsManager) { }
	  /*get jwt token*/
	setToken(token: string) :void
	{
		return window.localStorage.setItem('token', token);
	}
	
     /*get token*/
    getToken()
    {
      return window.localStorage.getItem('token');
    }
  /*set profile*/
    setVendor(vendorProfile): void
    {
        return window.localStorage.setItem('vendorProfile', vendorProfile);
    }
      /*get agency profile*/
    getVendor()
    {
        return window.localStorage.getItem('vendorProfile');
    }
      /*set user profile*/
    setUser(userProfile)
    {
        return window.localStorage.setItem('userProfile', userProfile);
    }
      /*get user profile*/
    getUser()
    {
        return window.localStorage.getItem('userProfile');
    }

    public showSuccess(message, title) {
        this.toastrService.success(message, title);
    }

    public showError(message, title) {
        this.toastrService.error(message, title);
    }

	header(){
        let headers = new Headers();
            headers.append('content-type', 'application/json');
        let token = this.getToken();
            if(token) {
                headers.append('Authorization', 'Bearer ' + token);      
            }
        let request       = new RequestOptions({ headers: headers });
        return request 
    }

    token_expired(status){
        console.log(status)
    }

    /*clear storage*/
    public ClearStorage(){
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('userProfile');
        window.localStorage.removeItem('vendorProfile');
    }

    /**
     * @method getPaginateData
     * get staff position resource
     * @return data
     */
    getPaginateData(url)
    {
      return this.http.get(url, this.header())
              .map((response : Response) => response.json());
    }

    yearjson()
    {
      return [
       {
        "name": "January",
        "short": "Jan",
        "number": 1,
        "days": 31
      },
      {
        "name": "February",
        "short": "Feb",
        "number": 2,
        "days": 28
      },
      {
        "name": "March",
        "short": "Mar",
        "number": 3,
        "days": 31
      },
      {
        "name": "April",
        "short": "Apr",
        "number": 4,
        "days": 30
      },
      {
        "name": "May",
        "short": "May",
        "number": 5,
        "days": 31
      },
      {
        "name": "June",
        "short": "Jun",
        "number": 6,
        "days": 30
      },
      {
        "name": "July",
        "short": "Jul",
        "number": 7,
        "days": 31
      },
      {
        "name": "August",
        "short": "Aug",
        "number": 8,
        "days": 31
      },
      {
        "name": "September",
        "short": "Sep",
        "number": 9,
        "days": 30
      },
      {
        "name": "October",
        "short": "Oct",
        "number": 10,
        "days": 31
      },
      {
        "name": "November",
        "short": "Nov",
        "number": 11,
        "days": 30
      },
      {
        "name": "December",
        "short": "Dec",
        "number": 12,
        "days": 31
      }
    ]
    }
}
