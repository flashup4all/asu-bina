import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of'
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService } from '../../../storage/local.service';
import { StaffService } from '../staff.service';
import { MembersService } from '../../membership/members.service';
import { environment } from '../../../../environments/environment';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  //styleUrls: ['./manage-staff.component.css']
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
export class ManageStaffComponent implements OnInit {
	public staffList = [];
  public editStaffData
  public staffPositionList;
  edit_staff_position_data;
  reset_password_data;
  reset_password_check;
	public userRolesList;
  user;
  vendor;
	submitPending : boolean;
	public newStaffForm : FormGroup;
	public newStaffPositionForm : FormGroup;
  public changePasswordForm:FormGroup;
	//private editStaffForm : FormGroup;
	public passport;
	public model;
  	path='';
 toPage;
 loader;
 total_staff;
 editMemberData;
 passwordFormCheck:boolean;
 searching: boolean;
  searchFailed: boolean;
  account_status;
	public file_srcs: string[] = [];
	 
	public debug_size_before: string[] = [];
	 
	public debug_size_after: string[] = [];
  image_url
  queryField: FormControl = new FormControl();
  results: any[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('newStaffModal') public newStaffModal :ModalDirective;
	@ViewChild('editStaffModal') public editStaffModal :ModalDirective;
	@ViewChild('newStaffPositionModal') public newStaffPositionModal :ModalDirective;
  @ViewChild('passwordModal') public passwordModal : ModalDirective;

    constructor(
  		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageStaffService : StaffService,
  		private sanitizer:DomSanitizer,
      private manageMemberService : MembersService,
      private changeDetectorRef: ChangeDetectorRef
  		) { 
        this.image_url = environment.api.imageUrl+'profile/staff/';
  		this.getStaffPosition();
      this.getStaff();
      this.account_status = this.localService.account_status();
      this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
      //this.getUserRoles();
       this.queryField.valueChanges
        .debounceTime(200)
        .distinctUntilChanged()
        .do(() => this.searching = true)
          .switchMap((query) =>  this.manageStaffService.filterStaff(query)
            .do(() => this.searchFailed = false)
                .catch(() => {
                  this.searchFailed = true;
                  return of([]);
                })
            )
          .subscribe( result => { 
            if (result.status === 400)
            { 
              return; 
            }else {  
              this.results = result; 
            }
          });
  	}

  	ngOnInit() {

  		this.newStaffForm = this._fb.group({
  			  staff_no : '',
	        first_name  : [null, Validators.compose([Validators.required])],
	        middle_name  : '',
	        last_name  : [null, Validators.compose([Validators.required])],
	        mobile_phone  : [null, Validators.compose([Validators.required])],
	        contact_phone  : '',
	        email: [null, Validators.compose([Validators.required, Validators.email])],
	        dob:[null],  
	        //password : [null, Validators.compose([Validators.required])],
	        information_pool :[],
	        gender :[null, Validators.compose([Validators.required])],
	        user_position_id :[null, Validators.compose([Validators.required])],
	        status :[null, Validators.compose([Validators.required])],
	        passport: '',
	        //approved_by :JSON.parse(this.localService.getUser()).id,
	        //vendor_id :JSON.parse(this.localService.getVendor()).id
	  		});
  		this.newStaffPositionForm = this._fb.group({
  			name : [null, Validators.compose([Validators.required])],
        role : [null, Validators.compose([Validators.required])],
        post_min_amount : [null, Validators.compose([Validators.required])],
  			post_max_amount : [null, Validators.compose([Validators.required])],
  		});
      /*password reset form*/
      this.changePasswordForm = this._fb.group({
        old_password:[null, Validators.compose([Validators.required])],
        new_password:[null, Validators.compose([Validators.required])],
        new_password_confirm:[null, Validators.compose([Validators.required])]
      })
  	}
  	/**
  	 * @method addStaffPosition
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	addStaffPosition(data)
  	{
      this.newStaffForm.updateValueAndValidity();
    if (this.newStaffForm.invalid) {
      Object.keys(this.newStaffForm.controls).forEach(key => {
        this.newStaffForm.get(key).markAsDirty();
      });
      return;
    }
  		this.submitPending = true;
  		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;

      if(this.edit_staff_position_data != null)
      {
        this.update_staff_position(data);
      }

  		this.manageStaffService.addStaffPosition(data).subscribe((response) => {
  	 		if(response.success = true)
			{
				this.submitPending = false;
	 			this.getStaffPosition()
         this.newStaffPositionForm.reset();
	 			this.newStaffPositionModal.hide();
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.submitPending = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	}, (error) => {
         this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
       });
  	}

    update_staff_position(data)
    {
      this.submitPending = true;
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      this.manageStaffService.updateStaffPosition(data, this.edit_staff_position_data.id).subscribe((response) => {
         if(response.success = true)
      {
        this.submitPending = false;
        this.edit_staff_position_data = null;
        this.getStaffPosition()
        this.newStaffPositionForm.reset();
        this.newStaffPositionModal.hide();
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.submitPending = false;
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
       }, (error) => {
         this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
       });
    }

    edit_staff_position(data)
    {
      this.edit_staff_position_data = data
      this.newStaffPositionModal.show()
    }
    new_staff_position()
    {
      this.edit_staff_position_data = null;
      this.newStaffPositionModal.show()
    }
    new_staff_modal()
    {
      this.editStaffData = null;
      this.newStaffModal.show()
    }
  	/**
  	 * @method getStaffPosition
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	 getStaffPosition()
  	 {
  	 	this.manageStaffService.getStaffPosition().subscribe((response) => {
  	 		this.staffPositionList = response.data
  	 	})
  	 }
  	 /**
  	 * @method deleteStaffPosition
  	 * creates a new staff position resource
  	 * @return data
  	 */
  	 deleteStaffPosition(id)
  	 {
  	 	  if(window.confirm('Are you sure you want to delete this item'))
        {
          this.manageStaffService.deleteStaffPosition(id).subscribe((response) => {
          this.getStaffPosition();
          this.localService.showSuccess('Deleted','Operation Unsuccessfull');
         }, (error) => {
          this.localService.showError('Error',error);
         })
        }
  	 }
  	/**
  	 * @method addStaff
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	addStaff(data)
  	{
      if(data.mobile_phone != null)
      {
        data.mobile_phone = '234'+(data.mobile_phone.substr(1));
      }
      if(data.contact_phone != null)
      {
        data.contact_phone = '234'+(data.contact_phone.substr(1));
      }
  		// data['passport'] = this.passport;
    //   data['approved_by'] = JSON.parse(this.localService.getUser()).id
    //   data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
  		this.submitPending = true;
      data = this.prepareSave();
  		this.manageStaffService.addStaff(data).subscribe((response) => {
  	 	if(response.success = true)
			{
				this.submitPending = false;
	 			this.getStaff();
        //this.staffList.push(data)
        this.newStaffForm.reset();
        this.clearFile()
	 			this.newStaffModal.hide();
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			/*else{
				this.submitPending = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}*/
  	 	}, (error) => {
        this.submitPending = false;
        this.localService.showError(error,'Operation UnSuccessfull');
       });

  	}
    
    format_mobile_no(phone)
    {
      return '0'+(phone.substr(3));
    }
  	/**
  	 * @method getStaff
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	getStaff()
  	{
      this.submitPending = true;
        this.manageStaffService.getStaff().subscribe((response) => {
         this.toPage = response.data.next_page_url;
         this.staffList = response.data.data;
         this.total_staff = response.total;
         this.submitPending = false;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.staffList.push(response.data[i])
         }*/
       })
  	}
    loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.data.next_page_url;
         this.staffList = response.data.data;
         this.loader = false;
        /*for(var i=0; i < response.data.length; i++)
         {
           this.staffList.push(response.data[i])
         }*/

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

    /**
     * @method editStaff
     * creates a new staff  resource
     * @return data
     */
    editStaff(data)
    {
        this.editStaffData = data;
        this.editStaffModal.show();
    }

    /**
     * @method updateStaff
     * updates a staff  resource
     * @return data
     */
    updateStaff(data, id)
    {
      this.submitPending = true;
      // data['id'] = this.editStaffData.id
      // data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      // data['passport'] = this.passport;
      data = this.prepareSave();
      this.manageStaffService.updateStaff(data, this.editStaffData.id).subscribe((response) => {
        if(response.success = true)
        {
          this.submitPending = false;
           this.getStaff();
          this.clearFile()
           this.file_srcs = [];
           this.editStaffModal.hide();
          this.localService.showSuccess(response.message,'Operation Successfull');
          //window.location.reload();
        }
       }, (error) => {
         this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }


    /**
     * @method deleteStaff
     * delete a staff  resource
     * @return data
     */
     deleteStaff(id)
     {
       if(window.confirm('Are you sure you want to delete this item'))
       {
         this.manageStaffService.deleteStaff(id).subscribe((response) => {
         this.getStaff();
      this.localService.showSuccess('Deleted','Operation USuccessfull');
       }, (error) => {
           this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       })
       }
     }
    /**
     * @method getUserRoles
     * creates a new staff  resource
     * @return data
     */
    getUserRoles()
    {
        this.manageStaffService.getUserRoles().subscribe((response) => {
         this.userRolesList = response.data
       })
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
    //   this.membersList = response.data
    // });
  }
  /**
   * @method resetPassword
   * send password reset link
   * @return data
   */
  resetPassword(data)
  {
    this.reset_password_check = false;
    this.passwordFormCheck = true;
    data = {
      vendor_id: JSON.parse(this.localService.getVendor()).id,
      user_id: data.user_id,
      email: data.email
    }
    this.manageMemberService.resetPassword(data).subscribe((response) => {
      if(response.success)
      {
        this.reset_password_data = response;
        this.reset_password_check = true;
        this.passwordFormCheck = false;
        this.localService.showSuccess(response.message,'Operation Successfull');
      }else{
        this.passwordFormCheck = false;
        this.localService.showError(response.message,'Operation UnsSuccessfull');
      }
    }, (error) => {
        this.reset_password_check = false;
         this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
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
    }, (error) => {
         this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
       });
  }

  private prepareSave(): any {
      let input = new FormData();
      input.append('staff_no', this.newStaffForm.get('staff_no').value);
      input.append('first_name', this.newStaffForm.get('first_name').value);
      input.append('last_name', this.newStaffForm.get('last_name').value);
      input.append('middle_name', this.newStaffForm.get('middle_name').value);
      input.append('gender', this.newStaffForm.get('gender').value);
      input.append('dob', this.newStaffForm.get('dob').value);
      input.append('user_position_id', this.newStaffForm.get('user_position_id').value);
      input.append('status', this.newStaffForm.get('status').value);
      input.append('email', this.newStaffForm.get('email').value);
      input.append('mobile_phone', this.newStaffForm.get('mobile_phone').value);
      input.append('contact_phone', this.newStaffForm.get('contact_phone').value);
      input.append('passport', this.newStaffForm.get('passport').value);
      input.append('vendor_id', this.vendor.id);
      input.append('approved_by', JSON.parse(this.localService.getUser()).id);
      return input;
  }

  onFileChange(event) {
      if(event.target.files.length > 0) {
        let file = event.target.files[0];
        this.newStaffForm.get('passport').setValue(file);
      }
    }

    clearFile() {
      this.newStaffForm.get('passport').setValue(null);
      this.fileInput.nativeElement.value = '';
    }
  	
}
