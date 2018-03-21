import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalService } from '../../storage/local.service';
@Injectable()

export class handleErrors{
  constructor(private router: Router){}
err(error: Response){
        //this.router.navigate(['/dashboard']);

     switch(error.status){
        case 500:
          return Observable.throw(error.json().message);
        case 404:
          return Observable.throw(error.json().message);
        case 400:
          return Observable.throw(error.json().message);
        case 401:
          let user = JSON.parse(window.localStorage.getItem('userProfile'))
          window.localStorage.clear()
          let password = window.confirm('your session has expired please login again to renew session');
          this.router.navigate(['auth']);
          //return Observable.throw(error.json().message);
        case 501:
          return Observable.throw(error.json().message);
        case 422:
         //TODO: find ways to display the validation message better
         //  Unprocessable Entity ( likely form validation error )
         //console.log(error);
         // return Observable.throw(error.json().message);
         let stringError  = "";
          for(let i in error.json().errors){
              //console.log(i);
              stringError = stringError + i;
          }
          //return Observable.throw( "Validation Error: "+JSON.stringify(error.json().errors));
          return Observable.throw( "Validation Error: "+ stringError);

        default:
          return Observable.throw("We could not perform the requested action at this time. Please check your network connectivity.");
     }
   }
}