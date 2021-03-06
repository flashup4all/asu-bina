import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../storage/index';
import { environment } from '../../../../environments/environment';

export interface Vendor {
	name:string;
	address: string;
	phone: number;
	administrative_charge: number;

}
@Component({
  selector: 'app-manage-vendor',
  templateUrl: './manage-vendor.component.html',
  //styleUrls: ['./manage-vendor.component.css']
  styles: [
    `.fa-spinner {
      -animation: spin .7s infinite linear;
      -webkit-animation: spin2 .7s infinite linear;
    }`,
    `@-webkit-keyframes spin2 {
      from { -webkit-transform: rotate(0deg);}
      to { -webkit-transform: rotate(360deg);}
    }`
  ]
})
export class ManageVendorComponent implements OnInit {
	image_url;
    public vendor;
	public editVendorData;
    public editVendorForm : FormGroup;
	public bankAccountForm : FormGroup;
	submitPending:boolean;
	public logo;
	public model;
  	path='';
	public file_srcs: string[] = [];
	bank_accounts;
	public debug_size_before: string[] = [];
	public debug_size_after: string[] = [];
    window;
    bank_list;
    editAccountData;
    countries = countries;
    currencies = currency;
    state_list;
    city_list;
    state_loader
    city_loader;
     @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('accountModal') public accountModal :ModalDirective;
    @ViewChild('accountUpdateModal') public accountUpdateModal :ModalDirective;

	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageVendorService : VendorService,
  		private changeDetectorRef: ChangeDetectorRef
		) {
            this.image_url = environment.api.imageUrl+'logo/';
			this.vendor = JSON.parse(this.localService.getVendor());
			this.editVendorData = JSON.parse(this.localService.getVendor());
            this.getAccountNumbers();
            //this.getBankList();
		}

	ngOnInit() {
		/*edit vendor form*/
		this.editVendorForm = this._fb.group({
			name: [null, Validators.compose([Validators.required])],
			address: [null, Validators.compose([Validators.required])],
			phone: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required, Validators.email])],
			administrative_charge: '',
            currency_code: '',
			country_id: '',
			state_province: '',
			charge_duration: '',
            description: '',
			privacy_policy: '',
            logo: ''
		});
        /*bank account form*/
        this.bankAccountForm = this._fb.group({
            bank_code: [null, Validators.compose([Validators.required])],
            account_number: [null, Validators.compose([Validators.required])],
            description: ''
        });
	}


	/**
	 * @method updateVendor
	 * updates Vendor Profile
	 * @return data
	 */
	updateVendor(data)
	{
        const formModel = this.prepareSave(data);
        console.log(data)
        console.log(formModel)
		this.submitPending = true;
	    this.manageVendorService.updateVendor(formModel).subscribe((response) => {
	      	if(response.success = true)
	      	{
	        	this.submitPending = false;
                this.vendor = response.data;
	         	this.localService.setVendor(JSON.stringify(response.data));
	        	this.localService.showSuccess(response.message,'Operation Successfull');
		      }
		      else{
		        this.submitPending = false;
		        this.localService.showError(response.message,'Operation Unsuccessfull');
		    }
		},(error) => {
            this.submitPending = false;
            //this.localService.showError(response.message,'Operation Unsuccessfull');
        });
            this.submitPending = false;

	}

    onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.logo = file;
    }
  }

  private prepareSave(data): any {
        let input = new FormData();
        input.append('name', data.name);
        input.append('address', data.address);
        input.append('phone', data.phone);
        input.append('email', data.email);
        input.append('administrative_charge', data.administrative_charge);
        input.append('currency_code', data.currency_code);
        input.append('country_id', data.country_id);
        input.append('state_province', data.state_province);
        input.append('charge_duration', data.charge_duration);
        input.append('description', data.description);
        input.append('privacy_policy', data.privacy_policy);
        input.append('logo', this.logo);
        input.append('vendor_id', this.vendor.id);
        return input;
    }


  clearFile() {
    this.editVendorForm.get('logo').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

    /*account number*/
    addAccountNumber(data)
    {
        data['vendor_id'] = this.vendor.id;
        data['bank_name'] = this.getBankName(data.bank_code)
        console.log(data)
        this.manageVendorService.addBankAccount(data).subscribe((response) => {
            if(response.success = true)
            {
                this.getAccountNumbers();
                this.submitPending = false;
                this.bankAccountForm.reset()
                this.accountModal.hide()
                this.localService.showSuccess(response.message,'Operation Successfull');
            } else{
                this.submitPending = false;
                this.localService.showError(response.message,'Operation Unsuccessfull');
                }
            },(error) => {
                this.submitPending = false;
                this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    newAccount()
    {
        this.editAccountData = [];
        this.accountModal.show()
    }

    editAccount(data)
    {
        this.editAccountData = data;
        this.accountUpdateModal.show()
    }

    updateAccountNumber(data)
    {
        data['id'] = this.editAccountData.id;
        data['vendor_id'] = this.vendor.id;
        data['bank_name'] = this.getBankName(data.bank_code)
        console.log(data)
        this.manageVendorService.updateBankAccount(data).subscribe((response) => {
                  if(response.success = true)
                  {
                      this.getAccountNumbers();
                    this.submitPending = false;
                    this.accountUpdateModal.hide()
                    this.localService.showSuccess(response.message,'Operation Successfull');
                  }
                  else{
                    this.submitPending = false;
                    this.localService.showError(response.message,'Operation Unsuccessfull');
                }
            },(error) => {
                this.submitPending = false;
                this.localService.showError(error,'Operation Unsuccessfull');
            });
    }
    getAccountNumbers()
    {
        this.manageVendorService.getBankAccount().subscribe((response) => {
            this.bank_accounts = response.data;
        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    deleteAccount(id)
    {
        this.manageVendorService.deleteBankAccount(id).subscribe((response) => {
            this.localService.showError(response.message,'Operation Unsuccessfull');

        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }
    getBankList()
    {
        this.manageVendorService.getBankList().subscribe((response) => {
            let group = [];
            let bank_list = response.data;
            for (var key in bank_list) {
                if (bank_list.hasOwnProperty(key)) {
                    let data = { code: key, name: bank_list[key]}
                 group.push(data)                
                }
            }
            this.bank_list = group;
        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    getBankName(code)
    {
        for (let i=0; i < this.bank_list.length; i++) {
            if(this.bank_list[i].code === code){
                let name = this.bank_list[i].name;
                return name;

            }
        }
    }

    filter_states(country_id)
    {
        this.state_loader = true;
        let array = [];
        for (var i in states) {
            if(states[i].country_id == country_id)
            {
                array.push(states[i])
            }
        }
        this.state_loader = false;
        this.state_list=  array;
    }

    filter_cities(state_id)
    {
        this.city_loader = true;
        let array = [];
        for (var i in cities) {
            if(cities[i].state_id == state_id)
            {
                array.push(cities[i])
            }
        }

        this.city_loader = false;
        this.city_list =  array;
    }
    cities_check(event)
    {
        console.log(event)
    }

    get_state(state_id)
    {
      for (var i in states) {
        if(states[i].id == state_id)
        {
          return states[i].name;
        }
      }
    }
    get_country(country_id)
    {
      for (var i in countries) {
        if(countries[i].id == country_id)
        {
          return countries[i].name;
        }
      }
    }

    // get_institution_type(type_id)
    // {
    //   for (var i in this.institution_types) {
    //     if(this.institution_types[i].id == type_id)
    //     {
    //       return this.institution_types[i].name;
    //     }
    //   }
    // }

	fileChange(input){
 
    this.readFiles(input.files);
     
    }
     
    readFile(file, reader, callback){
    reader.onload = () => {
       //this.passport = file;
       this.logo = reader.result;
    callback(reader.result);
     
    //this.model.logo=reader.result;
     
     
    }
 
 
    reader.readAsDataURL(file);
     
    }
 
    readFiles(files, index=0){
     
    // Create the file reader
     
    let reader = new FileReader();
     
     
    // If there is a file
     
    if(index in files){
     
    // Start reading this file
     
    this.readFile(files[index], reader, (result) =>{
     
    // Create an img element and add the image file data to it
     
    var img = document.createElement("img");
     
    img.src = result;
     
     
    // Send this img to the resize function (and wait for callback)
     
    this.resize(img, 250, 250, (resized_jpeg, before, after)=>{
     
    // For debugging (size in bytes before and after)
     
    this.debug_size_before.push(before);
     
    this.debug_size_after.push(after);
     
     
    // Add the resized jpeg img source to a list for preview
     
    // This is also the file you want to upload. (either as a
     
    // base64 string or img.src = resized_jpeg if you prefer a file).
     
    this.file_srcs.push(resized_jpeg);
     
     
    // Read the next file;
     
    this.readFiles(files, index+1);
     
    });
     
    });
     
    }else{
     
    // When all files are done This forces a change detection
     
    this.changeDetectorRef.detectChanges();
     
    }
     
    }
     
    resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, callback){
     
    // This will wait until the img is loaded before calling this function
     
    return img.onload = () => {
     
     
    // Get the images current width and height
     
    var width = img.width;
     
    var height = img.height;
     
     
    // Set the WxH to fit the Max values (but maintain proportions)
     
    if (width > height) {
     
    if (width > MAX_WIDTH) {
     
    height *= MAX_WIDTH / width;
     
    width = MAX_WIDTH;
     
    }
     
    } else {
     
    if (height > MAX_HEIGHT) {
     
    width *= MAX_HEIGHT / height;
     
    height = MAX_HEIGHT;
     
    }
     
    }
     
    // create a canvas object
     
    var canvas = document.createElement("canvas");
     
     
    // Set the canvas to the new calculated dimensions
     
    canvas.width = width;
     
    canvas.height = height;
     
    var ctx = canvas.getContext("2d");
     
     
    ctx.drawImage(img, 0, 0,  width, height);
     
     
    // Get this encoded as a jpeg
     
    // IMPORTANT: 'jpeg' NOT 'jpg'
     
    var dataUrl = canvas.toDataURL('image/jpeg');
     
     
    // callback with the results
     
    callback(dataUrl, img.src.length, dataUrl.length);
     
    };
     
    }
}
