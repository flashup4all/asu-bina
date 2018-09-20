import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router} from '@angular/router';

import { Subject } from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of'
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';
import { StaffService } from '../../staff/staff.service';

//import { XlsxToJsonService } from '../../../shared/xls/index'

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

	//private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
	public result: any;
	public newMemberForm: FormGroup;
	public changePasswordForm:FormGroup;
    filterForm: FormGroup;
	public membersList =[];
	public membersFormPoolList = [];
	public arrayData;
	public editMemberData;
	public vendor;
	items;
	image_url;
	passwordFormCheck: boolean;
	searching: boolean;
	searchFailed: boolean;
  	hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  	user
	submitPending;
	member_form_loader: boolean = false;
	show_adv_form: boolean = false;
	public passport;
	public model;
  	path='';
  	toPage;
  	loader;
  	total_members;
  	total_active_members
  	phone1;
 	staffList
 	generate_login_check : boolean = false;
	public file_srcs: string[] = [];
	 
	public debug_size_before: string[] = [];
	 
	public debug_size_after: string[] = [];
	questions = [];
	filterMemberForm: FormGroup;
	results: any[] = [];
	 @ViewChild('fileInput') fileInput: ElementRef;
	 @ViewChild('signaturefileInput') signaturefileInput: ElementRef;
	@ViewChild('passwordModal') public passwordModal : ModalDirective;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageMemberService : MembersService,
    	private staffService : StaffService,
  		private sanitizer:DomSanitizer,
  		private router : Router,
      private exportService: TableExportService,
  		private changeDetectorRef: ChangeDetectorRef
		) {
			this.getFormFields();
			this.getMembers()
			this.getStaff();
			this.vendor = JSON.parse(this.localService.getVendor());
		    this.user = JSON.parse(this.localService.getUser());
			this.image_url = environment.api.imageUrl+'profile/member/';
			/*this.queryField.valueChanges
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
		  		});*/


		 }

		search = (text$: Observable<string>) =>
    	text$
	      .debounceTime(300)
	      .distinctUntilChanged()
	      .do(() => this.searching = true)
	      .switchMap(term =>
	        this.manageMemberService.filterMembers(term)
	          .do(() => this.searchFailed = false)
	          .catch(() => {
	            this.searchFailed = true;
	            return of([]);
	          }))
	      .do(() => this.searching = false)
	      .merge(this.hideSearchingWhenUnsubscribed);
	      formatter = (x: {first_name: string, middle_name: string, last_name: string}) => x.first_name+'  '+ x.middle_name+'  '+ x.last_name;

	ngOnInit() {
		/*this.queryField.valueChanges
 			.subscribe( result => console.log(result));
 */

		this.newMemberForm = this._fb.group({
			first_name:[null, Validators.compose([Validators.required])],
			middle_name:'',
			last_name:[null, Validators.compose([Validators.required])],
			contribution:[null],
			gender:[null, Validators.compose([Validators.required])],
			date_of_birth:[null, Validators.compose([Validators.required])],
			passport:'',
			signature:'',
			account_number:'',
			membership_date:[null, Validators.compose([Validators.required])],
			email:[null/*, Validators.compose([Validators.required, Validators.email])*/],
			phone1: [null, Validators.compose([Validators.required])],
			memberData : this._fb.array([])
		});
		/*password reset form*/
		this.changePasswordForm = this._fb.group({
			old_password:[null, Validators.compose([Validators.required])],
			new_password:[null, Validators.compose([Validators.required])],
			new_password_confirm:[null, Validators.compose([Validators.required])]
		})

		this.filterMemberForm = this._fb.group({
			member:[null, Validators.compose([Validators.required])]
		})

		/*filter form*/
       this.filterForm = this._fb.group({
	        from : '',
	        to : '',
	        gender : '',
	        staff_id:''
	      })
	}
	initMembersForm(data) {
        return this._fb.group({
        key: '',
        id: data.id
      });
    }

    /**
     * @method getStaff
     * creates a new staff  resource
     * @return data
     */
    getStaff()
    {
      // this.submitPending = true;
        this.staffService.getStaff().subscribe((response) => {
         //this.toPage = response.data.next_page_url;
         this.staffList = response.data.data;
         //this.total_staff = response.total;
         // this.submitPending = false;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.staffList.push(response.data[i])
         }*/
       })
    }

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }

    printReciept(id): void {
      let printContents, popupWin;

      printContents = document.getElementById(id).outerHTML;
      popupWin = window.open('', '_blank', 'width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
              body{font-size:14px; text-align: center;}
                table {
                    margin: 5px;
                  
              }

              .center{
                text-align:center;
              }
              .full{
                width:100%;
              }
              .row{
                display: block;
              }

              .border, tr, th, td {
                  border: 1px solid black;
                  padding:2px;
                  border-collapse: collapse;
                   }
                   
              .no-border{ 
                  border: none !important;
                  }
                  
               .print-full{ 
                 width: 100%      
               }

               .print-half{ 
                 width: 48%;   
               }
               
               .left{ float: left;}
               
               .right{float: right;}
               
               
               .margin{ 5px;}
               .row{width:100%;}
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
  }
    viewMember(member)
    {
    	if(member.member.id)
    	{
    		this.router.navigate(['app/members/'+member.member.id+'/view']);
    	}
    }

     /*handleFile(event) {
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
	  }*/

	/**
	 * @method addMember
	 * add members resource
	 * @return data
	 */
	addMember(data) : void
	{
		console.log(data)
		this.newMemberForm.updateValueAndValidity();
		if (this.newMemberForm.invalid) {
		  Object.keys(this.newMemberForm.controls).forEach(key => {
		    this.newMemberForm.get(key).markAsDirty();
		  });
		  return;
		}
	    this.member_form_loader = true;
	     data = this.prepareSave();
		this.manageMemberService.addMember(data).subscribe((response) => {
			if(response.success)
	      	{
	        	this.member_form_loader = false;
	        	this.newMemberForm.reset();
	        	//this.getMembers();
	        	this.clearFile();
	        	this.membersList.unshift(response.data)
	        	this.localService.showSuccess(response.message,'Operation Successfull');
		      }
		      else{
		        this.member_form_loader = false;
		        this.localService.showError(response.message,'Operation Unsuccessfull');
		    }
		}, (error) => {
			this.member_form_loader = false;
		    this.localService.showError(error,'Operation Unsuccessfull');
		})
	}

	private prepareSave(): any {
	    let input = new FormData();
	    input.append('first_name', this.newMemberForm.get('first_name').value);
	    input.append('last_name', this.newMemberForm.get('last_name').value);
	    input.append('middle_name', this.newMemberForm.get('middle_name').value);
	    input.append('contribution', this.newMemberForm.get('contribution').value);
	    input.append('gender', this.newMemberForm.get('gender').value);
	    input.append('date_of_birth', this.newMemberForm.get('date_of_birth').value);
	    input.append('account_number', this.newMemberForm.get('account_number').value);
	    input.append('membership_date', this.newMemberForm.get('membership_date').value);
	    input.append('email', this.newMemberForm.get('email').value);
	    input.append('phone1', this.newMemberForm.get('phone1').value);
	    input.append('passport', this.newMemberForm.get('passport').value);
	    input.append('signature', this.newMemberForm.get('signature').value);
	    input.append('vendor_id', this.vendor.id);
	    input.append('approved_by', JSON.parse(this.localService.getUser()).id);
	    input.append('user_id', JSON.parse(this.localService.getUser()).user_id);
	    input.append('branch_id', JSON.parse(this.localService.getBranchData()).id);
	    return input;
	}

	filter_member(data){
		data['vendor_id'] = this.vendor.id;
		data['user_id'] = this.user.user_id;
		this.submitPending=true;
		this.manageMemberService.filter_member(data).subscribe((response) => {
			console.log(response)
			this.submitPending = false;
			this.membersList = response.data;
		}, (error) => {
			this.submitPending = false;
			console.log(error)
		});

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
		this.submitPending=true;
		this.manageMemberService.getMember().subscribe((response) => {
			this.submitPending=false;
			this.membersList = response.data.data;
			this.total_members = response.total_members;
			this.total_active_members = response.total_active_members;
			this.toPage = response.data.next_page_url;
         /*for(var i=0; i < response.data.data.length; i++)
         {
           this.membersList.push(response.data.data[i])
         }*/
		}, (error) => {
			console.log(error)
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
		let data ={
			id: id,
			user_id: this.user.user_id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.activateMember(data).subscribe((response) => {
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
		let data ={
			user_id: this.user.user_id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.activateAllMember(data).subscribe((response) => {
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
		let data ={
			user_id: this.user.user_id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.deactivateAllMember(data).subscribe((response) => {
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
		let data ={
			id: id,
			user_id: this.user.user_id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.deactivateMember(data).subscribe((response) => {
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
	 * @method generate_login_details
	 * send password reset link
	 * @return data
	 */
	generate_login_details(data)
	{
		this.generate_login_check = true;
		data = {
			vendor_id: JSON.parse(this.localService.getVendor()).id,
			user_id: JSON.parse(this.localService.getUser()).id,
			asusu_id: data.asusu_id,
			member_user_id: data.user_id,
			member_id: data.id,
			email: data.email
		}
		this.manageMemberService.generate_login_details(data).subscribe((response) => {
			if(response.success)
			{
				this.generate_login_check = false;
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.generate_login_check = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
		}, (error) => {
				this.generate_login_check = false;
				this.localService.showError('Server Error!! Please contact admin','Operation Unsuccessfull');

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
	
	onFileChange(event) {
	    if(event.target.files.length > 0) {
	      let file = event.target.files[0];
	      this.newMemberForm.get('passport').setValue(file);
	    }
	}

	onSignatureFileChange(e) {
	    if(e.target.files.length > 0) {
	      let signature = e.target.files[0];
	      this.newMemberForm.get('signature').setValue(signature);
	    }
	}

  onSubmit() {
    const formModel = this.prepareSave();
    console.log(formModel)
    this.submitPending = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
    setTimeout(() => {
      // FormData cannot be inspected (see "Key difference"), hence no need to log it here
      alert('done!');
      this.submitPending = false;
    }, 1000);
  }

  clearFile() {
    this.newMemberForm.get('passport').setValue(null);
    this.newMemberForm.get('signature').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.signaturefileInput.nativeElement.value = '';
  }
}
