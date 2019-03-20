import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { last } from 'rxjs-compat/operator/last';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';

//import * as XLSX from 'ts-xlsx';
@Component({
  selector: 'app-member-upload',
  templateUrl: './member-upload.component.html',
  styleUrls: ['./member-upload.component.scss']
})
export class MemberUploadComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  excel_data:any;
  upload_list;
  uploaded_list:any;
  failed_list:any;
  total_upload:number;
  number_of_successful_uploads: number = 0;
  number_of_failed_uploads: number = 0;
  upload_pending: boolean = false;
  upload_loader: boolean;// = false;
  show_table: boolean = false;
  vendor;
  user;
  error_msg: string;
  success_msg: string;
  constructor(private localService: LocalService, private manageMemberService: MembersService) {
    this.vendor = JSON.parse(this.localService.getVendor());
    this.user = JSON.parse(this.localService.getUser());
  }

  ngOnInit() {
    this.uploaded_list = [];
    this.failed_list = [];
  }

  on_file_change(event) {
    var reader = new FileReader();
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    if(this.file){
      this.upload_list = [];
      this.show_table = false;
      this.number_of_failed_uploads = 0;
      this.number_of_successful_uploads = 0;
    }
  }

  Upload() {
    this.upload_pending = true;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      console.log(first_sheet_name)
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.decode_row('A1'));
      let json = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      if (json.length <= 0) {
        this.error_msg = "Empty file uploaded, please verify that the uploaded file is excel and has appropiate data in it";
        return;
      }
      this.error_msg = ''
      this.upload_list = json;
      var lastItem = json[json.length - 1]; 
      if (lastItem.hasOwnProperty("first_name")) {
        console.log('first name true')
      } else {
        return this.localService.showError('first_name header incorrect', 'Operation Unsuccessfull');
      }
      if (lastItem.hasOwnProperty("last_name")) {
        console.log('last true')
      } else {
        return this.localService.showError('last_name header incorrect', 'Operation Unsuccessfull');
      }

      if (!lastItem.hasOwnProperty("middle_name")) {
        
      
        return this.localService.showError('middle_name header incorrect', 'Operation Unsuccessfull');
      }
      if (lastItem.hasOwnProperty("gender")) {
        console.log('last true')
      } else {
        return this.localService.showError('gender header incorrect', 'Operation Unsuccessfull');
      }
      if (!lastItem.hasOwnProperty("account_number")) {
        return this.localService.showError('account_number header incorrect', 'Operation Unsuccessfull');
      }
      if (!lastItem.hasOwnProperty("phone")) {
        return this.localService.showError('phone header incorrect', 'Operation Unsuccessfull');
      }

      for (let i in this.upload_list) {
        this.upload_list[i].status = 0;
      }
     this.total_upload = this.upload_list.length;
     this.excel_data = this.upload_list
      this.show_table = true;
    this.upload_pending = false;      
    }
    fileReader.readAsArrayBuffer(this.file);
  }
  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  private prepareSave(item): any {
    let input = new FormData();
    input.append('first_name', item.first_name);
    if(!item.last_name){
      item.last_name = '';
    }
    input.append('last_name', item.last_name);
    if(!item.middle_name){
      item.middle_name = '';
    }
    input.append('middle_name', item.middle_name);
    input.append('contribution', '0');
    if(!item.gender){
      item.gender = '';
    }
    input.append('gender', item.gender);
    if(!item.date_of_birth){
      item.date_of_birth = '';
    }
    input.append('date_of_birth', item.date_of_birth);
    if(!item.account_number){
      item.account_number = '';
    }
    input.append('account_number', item.account_number);
    if(!item.membership_date){
      item.membership_date = '';
    }
    input.append('membership_date', item.membership_date);
    if(!item.email){
      item.email = '';
    }
    input.append('email', item.email);
    if(!item.phone){
      item.phone = '';
    }
    input.append('phone1', item.phone);
    // input.append('passport', item.passport);
    // input.append('signature', item.signature);
    input.append('vendor_id', this.vendor.id);
    input.append('approved_by', JSON.parse(this.localService.getUser()).id);
    input.append('user_id', JSON.parse(this.localService.getUser()).user_id);
    input.append('branch_id', JSON.parse(this.localService.getBranchData()).id);
    return input;
  }

  save() {
    this.upload_loader = true;
    this.success_msg ="please wait while processing data (uploading). please ensure the last data has been uploaded";
    for (let i in this.upload_list) {
      let data = this.prepareSave(this.upload_list[i]);
      this.upload_list[i].status = 4;
      this.manageMemberService.addMember(data).subscribe((response) => {
        if (response.success) {
          this.upload_list[i].status = 1;
          this.uploaded_list.push(this.upload_list[i])
          this.localService.showSuccess(response.message, 'Operation Successfull');
          this.number_of_successful_uploads = this.uploaded_list.length
        }
        else {
          //this.member_form_loader = false;
          this.upload_list[i].status = 2;
          this.failed_list.push(this.upload_list[i])
          this.localService.showError(response.message, 'Operation Unsuccessfull');
          this.number_of_failed_uploads = this.failed_list.length

        }
      }, (error) => {
        //this.member_form_loader = false;
        //this.localService.showError(error,'Operation Unsuccessfull');
      })
    }
    //this.success_msg ="uploaded Successfully";
    this.excel_data = this.upload_list;    
    this.upload_loader= false;
  }
  percentageCalculator(value, total)
  {
    let percentage = 0;
    percentage = (value/total) * 100;
    return Math.round(percentage)
  }
  view_result(data)
  {
    this.upload_loader = true;
    this.upload_list = data
    this.upload_loader = false;

  }
}
