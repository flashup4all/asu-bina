import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import {
    handleErrors
} from '../helpers/index';

@Injectable()
export class DomainService {

    constructor(
        private http: Http,
        private handleErr: handleErrors
    ) {}

    private headers = new Headers({ 'Content-Type': 'application/json'});

    public GetDomain(domain){
    return this.http.get(environment.api.url + 'verify-vendor/' + domain, {headers: this.headers}).map((response: Response) => {
          return response.json().data}).catch((error)=>{return this.handleErr.err(error)});
    }
}