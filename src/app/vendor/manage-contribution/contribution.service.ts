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
     * @method approveChangeContribution
     * get all vendor loan request
     * @return data
     */
    create_contribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/contribution-history', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
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
     * @method get_all_plan_members
     * @param plan_id
     * get all contribution plan members
     * @return data
     */
    get_all_plan_members(plan_id)
    {
      return this.http.get(environment.api.url+'CoopManagement/member-contribution-plan/plan-members/'+JSON.parse(this.localService.getVendor()).id+'/'+plan_id, this.localService.header())
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

    /*contribution plan */
    /**
     * @method getContributionPlan
     * get all vendor contribution plan
     * @return data
     */
    getContributionPlan()
    {
      return this.http.get(environment.api.url+'contribution-plan'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addContributionType
     * filter contribution
     * @return data
     */
    addContributionPlan(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/contribution-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addContributionType
     * filter contribution
     * @return data
     */
    update_contribution_plan(data, id)
    {
      return this.http.post(environment.api.url+'CoopManagement/contribution-plan/'+id, data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getContribution_type
     * filter contribution
     * @return data
     */
    get_contribution_plan()
    {
      return this.http.get(environment.api.url+'CoopManagement/contribution-plan/vendor/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method getContribution_type
     * filter contribution
     * @return data
     */
    delete_contribution_plan(id)
    {
      return this.http.delete(environment.api.url+'CoopManagement/contribution-plan/delete/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /*member contribution plan*/
    /**
     * @method create_member_contribution_plan
     * filter contribution
     * @return data
     */
    create_member_contribution_plan(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member-contribution-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method approve_contribution
     * get member contribution history
     * @return data
     */
    approve_contribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/approve-contribution-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method cancel_contribution
     * get member contribution history
     * @return data
     */
    cancel_contribution(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/cancel-contribution-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method delete_contribution
     * get member contribution history
     * @return data
     */
    delete_member_contribution_plan(id, data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member-contribution-plan/delete/'+id, data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method delete_contribution_history
     * get member contribution history
     * @return data
     */
    delete_contribution_history(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/delete-contribution-history', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_member_contribution_plan
     * filter contribution
     * @return data
     */
    get_member_contribution_plan(member_id)
    {
      return this.http.get(environment.api.url+'CoopManagement/member-contribution-plan/'+JSON.parse(this.localService.getVendor()).id+'/'+member_id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method post_contribution_history
     * get member investment history
     * @return data
     */
    post_contribution_history(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/post-contribution-history', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
