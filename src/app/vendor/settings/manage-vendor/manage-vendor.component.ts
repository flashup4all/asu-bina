import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { VendorService } from '../../vendor.service';

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
	public vendor;
	public editVendorData;
	public editVendorForm : FormGroup;
	submitPending:boolean;
	public logo;
	public model;
  	path='';
	public file_srcs: string[] = [];
	 
	public debug_size_before: string[] = [];
	public debug_size_after: string[] = [];
    window;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageVendorService : VendorService,
  		private changeDetectorRef: ChangeDetectorRef
		) {
			this.vendor = JSON.parse(this.localService.getVendor());
			this.editVendorData = JSON.parse(this.localService.getVendor());
		}

	ngOnInit() {
		/*edit vendor form*/
		this.editVendorForm = this._fb.group({
			name: [null, Validators.compose([Validators.required])],
			address: [null, Validators.compose([Validators.required])],
			phone: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required, Validators.email])],
			administrative_charge: '',
			charge_duration: '',
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
		data['vendor_id'] = this.editVendorData.id;
		data['logo'] = this.logo ?this.logo : null;
			this.submitPending = true;
	      	this.manageVendorService.updateVendor(data).subscribe((response) => {
	      	if(response.success = true)
	      	{
                  console.log(response)
	        	this.submitPending = false;

	         	this.localService.setVendor(JSON.stringify(response.data));
	        	this.localService.showSuccess(response.message,'Operation Successfull');
                window.location.reload();
		      }
		      else{
		        this.submitPending = false;
		        this.localService.showError(response.message,'Operation Unsuccessfull');
		    }
		},(error) => {
            this.submitPending = false;
            //this.localService.showError(response.message,'Operation Unsuccessfull');
        });
	}




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
