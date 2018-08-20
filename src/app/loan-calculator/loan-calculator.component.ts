import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocalService } from '../storage/local.service';
import * as moment from 'moment';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorComponent implements OnInit {

  calculator_array
  public loan_calculator_form : FormGroup;
  show_loader: boolean = false;
  submitPending: boolean = false;
  interest_type;
  constructor(
  	private localService : LocalService,
  	private _fb : FormBuilder,
  	) {
        this.interest_type = this.localService.interest_type();
   }

  ngOnInit() {
  	//this.calculate_loan_reducing_balance();
  	this.loan_calculator_form =this._fb.group({
  			duration : [null, Validators.compose([Validators.required])],
  			amount : [null, Validators.compose([Validators.required])],
  			percentage : [null, Validators.compose([Validators.required])],
  			interest_type : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
  		});
  }

  calculate_loan_reducing_balance(amount, percentage, type, duration)
  {
  	duration = duration+1;
  	this.show_loader = true;
  	/*var a = moment([2018, 0, 28]);
	var b = moment();
	a.from(b) */
  	//var percentage = p;
  	//var daily_percentage = ((10 / 100) / 30).toFixed(4);
  	//let 3_decimal_daily_percentage = daily_percentage.toFixed(3)

  	let calculator_array = [];
  	//var amount = 100000;
	    var monthly = 10;
	    //var duration = 60;
	    var rate = ((percentage / 100) / 30).toFixed(4);

	    //rate = rate / 100 / 12;

	    var m = 0;    // number of months

	    while (amount > 0) {
	        var interest = amount * parseFloat(rate);
	        console.log(interest)
	        var principal = amount + interest;
	        console.log(principal)
	        let array = {
	  			original_amount: amount.toFixed(2),
	  			principal: principal.toFixed(2),
	  			interest:interest.toFixed(2)
	  		}
  			calculator_array.push(array)
  			console.log(duration--)
	        if (duration > 0) {
	            //principal = amount;
	            amount = principal;
	        } else {
	            amount -= principal;
	        }

	        // build table: m + 1, principal, interest, amount

	        m++;
	    }
  	this.calculator_array = calculator_array;
  	//console.log(calculator_array.pop().original_amount)
  	this.show_loader = false;
  }
 /* buildTable() {

	    var amount = 100000;
	    var monthly = 10;
	    var rate = parseFloat((10 / 100) / 30).toFixed(4);

	    //rate = rate / 100 / 12;

	    var m = 0;    // number of months

	    while (amount > 0) {
	        var interest = amount * rate;
	        var principal = monthly + interest;

	        if (principal > amount) {
	            principal = amount;
	            amount = 0.0;
	        } else {
	            amount -= principal;
	        }

	        // build table: m + 1, principal, interest, amount

	        m++;
	    }

	    // display table
	}*/

	flat_rate(amount, percentage, type, duration)
	{
		/*$percentageInterest = $loanRequest->amount*($loanSetting->interest/100);
        $totalPayment = $loanRequest->amount + $loanRequest->interest_amount;
        $monthtlyDeductions = round($totalPayment / $loanSetting->duration, 2);*/

        this.show_loader = true;
	  	/*var a = moment([2018, 0, 28]);
		var b = moment();
		a.from(b) */
	  	//var percentage = p;
	  	var daily_percentage = ((10 / 100) / 30).toFixed(4);
	  	//let 3_decimal_daily_percentage = daily_percentage.toFixed(3)

	  	let calculator_array = [];
	  	//var amount = 100000;
	  		amount = amount / duration
		    var monthly = 10;
		    //var duration = 60;
		    var rate = ((percentage / 100) / duration).toFixed(4);

		    //rate = rate / 100 / 12;

		    var m = 0;    // number of months

		    while (amount > 0) {
		        var interest = amount * parseFloat(rate);
		        console.log(interest)
		        var principal = amount + interest;
		        console.log(principal)
		        let array = {
		  			original_amount: amount.toFixed(2),
		  			principal: principal.toFixed(2),
		  			interest:interest.toFixed(2)
		  		}
	  			calculator_array.push(array)
	  			console.log(duration--)
		        if (duration > 0) {
		            //principal = amount;
		            amount = amount;
		        } else {
		            amount -= amount;
		        }

		        // build table: m + 1, principal, interest, amount

		        m++;
		    }
	  	this.calculator_array = calculator_array;
        this.show_loader = false;

	}

	calculate_interest(form_values)
	{
		console.log(form_values)
		if(form_values.interest_type == 1)
		{
			this.flat_rate(form_values.amount, form_values.percentage, form_values.interest_type, form_values.duration)
		}
		if(form_values.interest_type == 2)
		{
			this.calculate_loan_reducing_balance(form_values.amount, form_values.percentage, form_values.interest_type, form_values.duration)
		}
	}
}
