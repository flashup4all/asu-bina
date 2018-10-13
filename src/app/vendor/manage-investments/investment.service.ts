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
export class InvestmentService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }

    /*investment plan */
    /**
     * @method getInvestementPlan
     * get all vendor investment plan
     * @return data
     */
    getInvestementPlan()
    {
      return this.http.get(environment.api.url+'investment-plan'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addInvestmentPlan
     * filter investment
     * @return data
     */
    addInvestmentPlan(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/investment-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method update_investment_plan
     * filter investment
     * @return data
     */
    update_investment_plan(data, id)
    {
      return this.http.post(environment.api.url+'CoopManagement/investment-plan/'+id, data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_investment_plan
     * filter investment
     * @return data
     */
    get_investment_plan()
    {
      return this.http.get(environment.api.url+'CoopManagement/investment-plan/vendor/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method delete_investment_plan
     * filter investment
     * @return data
     */
    delete_investment_plan(id)
    {
      return this.http.delete(environment.api.url+'CoopManagement/investment-plan/delete/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method create_member_investment_plan
     * filter investment
     * @return data
     */
    create_member_investment_plan(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member-investment-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method approve_investment
     * get member investment history
     * @return data
     */
    approve_investment(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/approve-investment-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method cancel_investment
     * get member investment history
     * @return data
     */
    cancel_investment(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/cancel-investment-plan', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_member_investment_plan
     * filter investment
     * @return data
     */
    get_member_investment_plan(member_id)
    {
      return this.http.get(environment.api.url+'CoopManagement/member-investment-plan/'+JSON.parse(this.localService.getVendor()).id+'/'+member_id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method get_vendor_investment_plan
     * filter investment
     * @return data
     */
    get_vendor_member_investment_plan()
    {
      return this.http.get(environment.api.url+'CoopManagement/member-investment-plan/vendor/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    // investment history
    /**
     * @method create_investment_history
     * filter investment
     * @return data
     */
    create_investment_history(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/investment-history', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method get_member_investment_history
     * get member investment history
     * @return data
     */
    get_member_investment_history(member_id)
    {
      return this.http.get(environment.api.url+'CoopManagement/investment-history/member/'+JSON.parse(this.localService.getVendor()).id+'/'+member_id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method post_investment_history
     * get member investment history
     * @return data
     */
    post_investment_history(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/post-investment-history', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method filter_investment_history
     * get member investment history
     * @return data
     */
    filter_investment_history(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/investment-history/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method filter_member_investment_plan
     * get member investment history
     * @return data
     */
    filter_member_investment_plan(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/member-investment-plan/vendor/filter', data, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /**
     * @method get_vendor_investment_history
     * get member investment history
     * @return data
     */
    get_vendor_investment_history()
    {
      return this.http.get(environment.api.url+'CoopManagement/investment-history/vendor/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
