import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../storage/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  //styleUrls: ['./manage-vendor.component.css']
})
export class BranchesComponent implements OnInit {
	image_url;
  public user;
  public vendor;
	public editVendorData;
	public branchForm : FormGroup;
	submitPending:boolean;
	public logo;
	public model;
  path='';
	public file_srcs: string[] = [];
	branches;
	approve_btn_loader: boolean = false;
  edit_branch_data;
  @ViewChild('branchesModal') public branchesModal :ModalDirective;

	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageVendorService : VendorService,
  		private changeDetectorRef: ChangeDetectorRef
		) {
            this.image_url = environment.api.imageUrl+'logo/';
      this.vendor = JSON.parse(this.localService.getVendor());
			this.user = JSON.parse(this.localService.getUser());
			this.editVendorData = JSON.parse(this.localService.getVendor());
            //this.getAccountNumbers();
      this.get_branches();
		}

	ngOnInit() {
    /*bank account form*/
    this.branchForm = this._fb.group({
        name: [null, Validators.compose([Validators.required])],
        address: [null, Validators.compose([Validators.required])],
        description: ''
    });
	}

  new_branch_modal()
  {
    this.edit_branch_data = null;
    this.branchesModal.show();
  }

  store_branch(data)
  {
    if(this.edit_branch_data != null)
    {
      this.update_a_branch(data);
    }else{
      this.add_a_branch(data);
    }
  }
  /**
   * @method add_a_branch
   *
   *
   */
  add_a_branch(formValues)
  {
      formValues['vendor_id'] = this.vendor.id;
      formValues['staff_id'] = this.user.id;
      formValues['user_id'] = this.user.user_id;

      this.submitPending = true;
      this.manageVendorService.addVendorBranches(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          this.branchForm.reset();
          this.branchesModal.hide();
          this.get_branches()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
              this.localService.showError('Server Error','Operation Unsuccessfull');
      })
  }

  update_a_branch(formValues)
  {
      formValues['id'] = this.edit_branch_data.id;
      formValues['vendor_id'] = this.vendor.id;
      formValues['staff_id'] = this.user.id;
      formValues['user_id'] = this.user.user_id;
      this.submitPending = true;
      this.manageVendorService.updateVendorBranches(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          this.edit_branch_data = null;
          this.branchesModal.hide();
          this.branchForm.reset();
          this.get_branches()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
              this.localService.showError('Server Error','Operation Unsuccessfull');
      })
  }

  get_branches()
  {
      this.manageVendorService.getVendorBranches().subscribe((response) => {
          this.branches = response.data;
      },(error) => {
          this.localService.showError(error,'Operation Unsuccessfull');
          });
  }
  edit_branch_modal(data)
  {
    this.edit_branch_data = data;
    this.branchesModal.show();
  }

  delete_a_branch(id)
  {
    let data = {
      id : id,
      vendor_id : this.vendor.id,
      staff_id : this.user.id,
      user_id : this.user.user_id,
    }
      
      this.approve_btn_loader = true;
      this.manageVendorService.deleteVendorBranches(data).subscribe((response) => {
        if (response.success) {
          this.approve_btn_loader = false;
          this.get_branches()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.approve_btn_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.approve_btn_loader = false;
              this.localService.showError('Server Error','Operation Unsuccessfull');
      })
  }

}