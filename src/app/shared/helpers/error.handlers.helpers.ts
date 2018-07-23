import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { LocalService } from '../../storage/local.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()

export class handleErrors{
  session_data;
  constructor(
    private router: Router,
    private authService : AuthService,
    private localService: LocalService, 

    ){
    this.session_data = JSON.parse(this.localService.getSessionData());

  }
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
          this.authService.logout(this.session_data.id).subscribe((response) => {
            if(response.success)
            {
              window.localStorage.clear()
              this.router.navigate(['auth'])
            }
          }, (error) => {
              window.localStorage.clear()
              this.router.navigate(['auth'])
          })
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