import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
    handleErrors
} from '../../shared/helpers/index';
import { LocalService } from '../../storage/local.service';

import { environment } from '../../../environments/environment';


@Injectable()
export class ContributionService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	
  	/**
     * @method getContributions
     * get all vendor loan request
     * @return data
     */
    getContributions()
    {
      return this.http.get(environment.api.url+'CoopManagement/contributions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getAllCoorpMembers
     * get all vendor loan request
     * @return data
     */
    getAllCoorpMembers()
    {
      return this.http.get(environment.api.url+'CoopManagement/all-coop-members/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getChangeContributionRequest
     * get all vendor loan request
     * @return data
     */
    getChangeContributionRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/change-contribution/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method approveChangeContribution
     * get all vendor loan request
     * @return data
     */
    approveChangeContribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/approve-change-contribution', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method runContributions
     * get form field resource
     * @return data
     */
    runContributions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-contributions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method runEditedContributions
     * get form field resource
     * @return data
     */
    runEditedContributions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-edited-contributions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     uploadExcelContributionFormat(data)
    {
       let headers = new Headers();
      return this.http.post(environment.api.url+'import-excel', data, { headers: headers})
                  .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /*contribution plan type*/
    /**
     * @method getChangeContributionRequest
     * get all vendor loan request
     * @return data
     */
    getContributionPlanType()
    {
      return this.http.get(environment.api.url+'contribution-plan-type'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method filterContribution
     * filter contribution
     * @return data
     */
    filterContribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/contribution-history/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addContributionType
     * filter contribution
     * @return data
     */
    addContributionType(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/contribution-types/create', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getContribution_type
     * filter contribution
     * @return data
     */
    get_contribution_type()
    {
      return this.http.get(environment.api.url+'CoopManagement/contribution-types/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getContribution_type
     * filter contribution
     * @return data
     */
    delete_contribution_type(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/contribution-types/delete/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
