import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
    handleErrors
} from '../../../shared/helpers/index';

import { LocalService } from '../../../storage/local.service';

import { environment } from '../../../../environments/environment';
@Injectable()
export class LoanSettingsService {

  	constructor(public http : Http, private localService : LocalService, private handleErr: handleErrors) { }
  	/**
  	 * @method addLoanSignatory
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	addLoanSignatory(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/loan-signatory',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}


  	/**
  	 * @method getLoanSignatory
  	 * get staff position resource
  	 * @return data
  	 */
  	getLoanSignatory()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/loan-signatory/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method updateLoanSignatory
  	 * updates a LoanSignatory  resource
  	 * @return data
  	 */
  	updateLoanSignatory(data, id)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/loan-signatory/update/'+id,JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method deleteLoanSignatory
  	 * delete staff position resource
  	 * @return data
  	 */
  	deleteLoanSignatory(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/loan-signatory/delete',data, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method getManagementStaff
  	 * get staff position resource
  	 * @return data
  	 */
  	getManagementStaff()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/management-staff/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

  	/*manage loan type request*/
  	/**
  	 * @method addLoanType
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	addLoanType(data)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/loan-type',JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method getLoanType
  	 * get staff position resource
  	 * @return data
  	 */
  	getLoanType()
  	{
  		return this.http.get(environment.api.url+'CoopManagement/loan-type/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

  	/**
  	 * @method updateLoanType
  	 * updates a LoanSignatory  resource
  	 * @return data
  	 */
  	updateLoanType(data, id)
  	{
  		return this.http.post(environment.api.url+'CoopManagement/loan-type/update/'+id,JSON.stringify(data), this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}
  	/**
  	 * @method deleteLoanType
  	 * delete staff position resource
  	 * @return data
  	 */
  	deleteLoanType(id)
  	{
  		return this.http.delete(environment.api.url+'CoopManagement/loan-type/'+id, this.localService.header())
  						.map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
  	}

    /*loan items*/
    /**
     * @method getLoanSignatory
     * get staff position resource
     * @return data
     */
    getLoanItem(id)
    {
      return this.http.get(environment.api.url+'CoopManagement/loan-type-item/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method addLoanItem
     * creates a new staff position resource
     * @return data
     */
    addLoanItem(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/loan-type-item',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method updateLoanItem
     * creates a new staff position resource
     * @return data
     */
    updateLoanItem(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/update-loan-type-item',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /**
     * @method deleteLoanItem
     * delete staff position resource
     * @return data
     */
    deleteLoanItem(id)
    {
      return this.http.delete(environment.api.url+'CoopManagement/delete-loan-item/'+id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

    /*threshold method*/
    /**
     * @method updateThreshold
     * update threshold settings resource
     * @return data
     */
    updateThreshold(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/threshold/update',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getThreshold
     * get reshold  resource
     * @return data
     */
    getThreshold()
    {
      return this.http.get(environment.api.url+'CoopManagement/threshold/get/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }

     /*eligibility settings  method*/
    /**
     * @method updateThreshold
     * update threshold settings resource
     * @return data
     */
    updateEligibility(data)
    {
      return this.http.post(environment.api.url+'CoopManagement/eligibility/update',JSON.stringify(data), this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /**
     * @method getThreshold
     * get reshold  resource
     * @return data
     */
    getEligibility()
    {
      return this.http.get(environment.api.url+'CoopManagement/eligibility/get/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
    /*settings*/
    /**
     * @method getSettings
     * get settings resource
     * @return data
     */
    getSettings()
    {
      return this.http.get(environment.api.url+'CoopManagement/settings/get/'+JSON.parse(this.localService.getVendor()).id, this.localService.header())
              .map((response : Response) => response.json()).catch((error)=>{return this.handleErr.err(error)});
    }
}
