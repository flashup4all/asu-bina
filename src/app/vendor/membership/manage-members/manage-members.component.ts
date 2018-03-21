import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of'
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';
import { XlsxToJsonService } from '../../../shared/xls/index'

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  //styleUrls: ['./manage-members.component.css']
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
export class ManageMembersComponent implements OnInit {

	private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
	public result: any;
	public newMemberForm: FormGroup;
	public changePasswordForm:FormGroup;
	public membersList =[];
	public membersFormPoolList = [];
	public arrayData;
	public editMemberData;
	public vendor;
	items;
	passwordFormCheck: boolean;
	searching: boolean;
searchFailed: boolean;
	submitPending;
	public passport;
	public model;
  	path='';
  	toPage;
  	loader;
  	total_members;
  	total_active_members
 
	public file_srcs: string[] = [];
	 
	public debug_size_before: string[] = [];
	 
	public debug_size_after: string[] = [];
	questions = [];
	queryField: FormControl = new FormControl();
	results: any[] = [];
	@ViewChild('passwordModal') public passwordModal : ModalDirective;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageMemberService : MembersService,
  		private sanitizer:DomSanitizer,
  		private changeDetectorRef: ChangeDetectorRef
		) {
			this.getFormFields();
			this.getMembers()
			this.vendor = JSON.parse(this.localService.getVendor());
			
			this.queryField.valueChanges
				.debounceTime(200)
				.distinctUntilChanged()
				.do(() => this.searching = true)
		    	.switchMap((query) =>  this.manageMemberService.filterMembers(query)
		    		.do(() => this.searchFailed = false)
			          .catch(() => {
			            this.searchFailed = true;
			            return of([]);
			          })
		    		)
		    	.subscribe( result => { 
		    		if (result.status === 400)
		    		{ 
		    			this.searching = false
		    			return; 
		    		}else {  
		    			this.searching = false
		    			this.results = result; 
		    		}
		  		});

		 }

	ngOnInit() {
		/*this.queryField.valueChanges
 			.subscribe( result => console.log(result));
 */

		this.newMemberForm = this._fb.group({
			first_name:[null, Validators.compose([Validators.required, Validators.email])],
			middle_name:[null, Validators.compose([Validators.required, Validators.email])],
			last_name:[null],
			contribution:[null],
			gender:[null],
			email:[null, Validators.compose([Validators.required, Validators.email])],
			phone1: [null, Validators.compose([Validators.required])],
			memberData : this._fb.array([])
		});
	/*password reset form*/
	this.changePasswordForm = this._fb.group({
		old_password:[null, Validators.compose([Validators.required])],
		new_password:[null, Validators.compose([Validators.required])],
		new_password_confirm:[null, Validators.compose([Validators.required])]
	})
	}
	initMembersForm(data) {
        return this._fb.group({
        key: '',
        id: data.id
      });
    }

     handleFile(event) {
	    if(window.confirm('are you sure you want to upload this members?, please note this process cannot be reversed.'))
	    {
	    	let file = event.target.files[0];
		    this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
		    this.result = JSON.stringify(data['sheets'].Sheet1);
		    console.log(data['sheets'].Sheet1);
			    this.manageMemberService.uploadMember(data).subscribe((response) => {
					if(response.success = true)
			      	{
			        	this.submitPending = false;
			        	//this.getMembers();
			        	//this.membersList.push(data)
			        	this.localService.showSuccess(response.message,'Operation Successfull');
				      }
				      else{
				        this.submitPending = false;
				        this.localService.showError(response.message,'Operation Unsuccessfull');
				    }
				}, (error) => {
					this.submitPending = false;
				    this.localService.showError(error,'Operation Unsuccessfull');
				})
		    });
	    }
	  }

	/**
	 * @method addMember
	 * add members resource
	 * @return data
	 */
	addMember(data) : void
	{
		// this.items = this.newMemberForm.get('memberData') as FormArray;
  		//this.items.push(this.initAddress());
		data['vendor_id'] = this.vendor.id;
		data['approved_by'] = JSON.parse(this.localService.getUser()).id;
		data['passport'] = this.passport;
		console.log(data)
		this.manageMemberService.addMember(data).subscribe((response) => {
			if(response.success = true)
	      	{
	        	this.submitPending = false;
	        	this.newMemberForm.reset();
	        	this.getMembers();
	        	this.membersList.push(data)
	        	this.localService.showSuccess(response.message,'Operation Successfull');
		      }
		      else{
		        this.submitPending = false;
		        this.localService.showError(response.message,'Operation Unsuccessfull');
		    }
		}, (error) => {
			this.submitPending = false;
		    this.localService.showError(error,'Operation Unsuccessfull');
		})
	}
	logForm(data){
		console.log(data)

	}
	/**
	 * @method getFormFields
	 * get members form field
	 * @return data
	 */
	getFormFields()
	{
		this.manageMemberService.getFormField().subscribe((response) => {
			this.membersFormPoolList = response.data
			console.log(this.membersFormPoolList)
			//create form controls for the fee items
	      this.membersFormPoolList.forEach((fields)=> 
	            (<FormArray>this.newMemberForm.controls['memberData']).push(this.initMembersForm(fields))
	        );
		});
	}
	/**
	 * @method getMembers
	 * get members form field
	 * @return data
	 */
	getMembers()
	{
		this.manageMemberService.getMember().subscribe((response) => {
			this.membersList = response.data.data;
			this.total_members = response.total_members;
			this.total_active_members = response.total_active_members;
			this.toPage = response.data.next_page_url;
         /*for(var i=0; i < response.data.data.length; i++)
         {
           this.membersList.push(response.data.data[i])
         }*/
		});
	}

	loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.data.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.data.length; i++)
         {
           this.membersList.push(response.data.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }


	/**
	 * @method activateMember
	 * activate member
	 * @return data
	 */
	activateMember(id)
	{
		this.manageMemberService.activateMember(id).subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}
	/**
	 * @method activateAllMember
	 * activate member
	 * @return data
	 */
	activateAllMember()
	{
		this.manageMemberService.activateAllMember().subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}

	/**
	 * @method activateAllMember
	 * activate member
	 * @return data
	 */
	deactivateAllMember()
	{
		this.manageMemberService.deactivateAllMember().subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}

	/**
	 * @method deactivateMember
	 * deactivate member
	 * @return data
	 */
	deactivateMember(id)
	{
		this.manageMemberService.deactivateMember(id).subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}

	/**
	 * @method editPassword
	 * launches edit password modal
	 * @return data
	 */
	editPassword(data)
	{
		this.editMemberData = data;
		this.passwordModal.show();
		// this.manageMemberService.getMember().subscribe((response) => {
		// 	this.membersList = response.data
		// });
	}
	/**
	 * @method resetPassword
	 * send password reset link
	 * @return data
	 */
	resetPassword(data)
	{
		console.log(data)
		data = {
			vendor_id: JSON.parse(this.localService.getVendor()).id,
			user_id: data.id,
			email: data.email
		}
		this.manageMemberService.resetPassword(data).subscribe((response) => {
			if(response.success)
			{
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}
	/**
	 * @method changePassword
	 * change member password
	 * @return data
	 */
	changePassword(data)
	{	
		this.passwordFormCheck = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
		data['user_id'] = this.editMemberData.id;
		console.log(data)
		this.manageMemberService.changePassword(data).subscribe((response) => {
			if(response.success)
			{
				this.passwordFormCheck = false;
				this.passwordModal.hide()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.passwordFormCheck = false;
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}
	fileChange(input){
 
    this.readFiles(input.files);
     
    }
     
    readFile(file, reader, callback){
    reader.onload = () => {
       
       //this.passport = file;
       this.passport = reader.result;
    callback(reader.result);
      
     
    this.model.passport=reader.result;
     
    console.log(reader.result);
     
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
