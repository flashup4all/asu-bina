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

  	constructor(public http : Http, private localService : LocalService) { }
  	
  	/**
     * @method getContributions
     * get all vendor loan request
     * @return data
     */
    getContributions()
    {
      return this.http.get(environment.api.url+'CoopManagement/contributions/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method getAllCoorpMembers
     * get all vendor loan request
     * @return data
     */
    getAllCoorpMembers()
    {
      return this.http.get(environment.api.url+'CoopManagement/all-coop-members/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method getChangeContributionRequest
     * get all vendor loan request
     * @return data
     */
    getChangeContributionRequest()
    {
      return this.http.get(environment.api.url+'CoopManagement/change-contribution/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method approveChangeContribution
     * get all vendor loan request
     * @return data
     */
    approveChangeContribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/approve-change-contribution', JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method runContributions
     * get form field resource
     * @return data
     */
    runContributions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-contributions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

    /**
     * @method runEditedContributions
     * get form field resource
     * @return data
     */
    runEditedContributions(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/run-edited-contributions',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch(handleErrors);
    }

     uploadExcelContributionFormat(data)
    {
       let headers = new Headers();
      return this.http.post(environment.api.url+'import-excel', data, { headers: headers})
                  .map((response : Response) => response.json()).catch(handleErrors);
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
              .map((response : Response) => response.json()).catch(handleErrors);
    }
}
