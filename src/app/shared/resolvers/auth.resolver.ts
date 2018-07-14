import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { LocalService } from '../../storage/index';
import {
    DomainService
} from '../services/index';


@Injectable()
export class AuthRoutesResolver implements Resolve<any> {

    constructor(
        private router:Router,  
        private domainService: DomainService,
        private localStorage: LocalService
    ){}
    resolve(route: ActivatedRouteSnapshot){
      // let domain = +route.params['domain'1]
      let domain = window.location.host;
      const subdomain = this.localStorage.GetSubDomain(domain);
      if(this.localStorage.getVendor() == null || this._objectify(this.localStorage.getVendor()).domain != subdomain){
        return this.domainService.GetDomain(subdomain)
        .subscribe(response => {
          if(response == null){
            return false;
          } else {
            if(response){
              this.localStorage.setVendor(this._stringify(response));
              return response;
            }
            else{
              return false;
            }
          }
        })
      }
      else{
        let response = this.localStorage.getVendor();
        return this._objectify(response);
      }
    }

    private _objectify(data){
      return JSON.parse(data);
    }

    private _stringify(data){
      return JSON.stringify(data);
    }
}
