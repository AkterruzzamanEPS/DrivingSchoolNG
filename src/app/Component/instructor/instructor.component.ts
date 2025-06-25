import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { InstructorFilterRequestDto, InstructorRequestDto } from '../../Model/Instructor';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss',
  providers: [DatePipe]
})
export class InstructorComponent implements OnInit {

  private instructorGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public instructorList: any[] = [];
  public userList: any[] = [];
  public oInstructorFilterRequestDto = new InstructorFilterRequestDto();
  public oInstructorRequestDto = new InstructorRequestDto();

  public instructorId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'name', width: 150, headerName: 'Name', filter: true },
    { field: 'email', width: 150, headerName: 'Email', filter: true },
    { field: 'phone', width: 150, headerName: 'Phone', filter: true },
    { field: 'licenseNumber', width: 150, headerName: 'License Number', filter: true },
    { field: 'yearsOfExperience', width: 150, headerName: 'Years Of Experience', filter: true },
    { field: 'address', width: 150, headerName: 'Address', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByInstructor: TrackByFunction<any> | any;
  trackByInstructorFrom: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.GetAspNetUsersByType();
    this.GetInstructor();
  }

  onGridReadyTransection(params: any) {
    this.instructorGridApi = params.api;
    this.rowData = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }

  Filter() {
    this.GetInstructor();
  }

  private GetInstructor() {
    this.oInstructorFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oInstructorFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Instructor/GetInstructor?pageNumber=${this.pageIndex}`, this.oInstructorFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.instructorGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  private GetAspNetUsersByType() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`AspNetUsers/GetAspNetUsersByType?Type=3`).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertInstructor() {
    if (this.oInstructorRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }

    this.oInstructorRequestDto.yearsOfExperience = Number(this.oInstructorRequestDto.yearsOfExperience);
    this.oInstructorRequestDto.isActive = CommonHelper.booleanConvert(this.oInstructorRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Instructor/InsertInstructor`, this.oInstructorRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetInstructor();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateInstructor() {

    if (this.oInstructorRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oInstructorRequestDto.isActive = CommonHelper.booleanConvert(this.oInstructorRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Instructor/UpdateInstructor/${this.instructorId}`, this.oInstructorRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetInstructor();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteInstructor() {
    this.oInstructorRequestDto.isActive = CommonHelper.booleanConvert(this.oInstructorRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Instructor/DeleteInstructor/${this.instructorId}`, this.oInstructorRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetInstructor();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oInstructorRequestDto = new InstructorRequestDto();
    this.instructorId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.instructorGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.instructorId = Number(getSelectedItem.id);
    this.oInstructorRequestDto.name = getSelectedItem.name;
    this.oInstructorRequestDto.email = getSelectedItem.email;
    this.oInstructorRequestDto.phone = getSelectedItem.phone;
    this.oInstructorRequestDto.address = getSelectedItem.address;
    this.oInstructorRequestDto.userId = getSelectedItem.userId;
    this.oInstructorRequestDto.licenseNumber = getSelectedItem.licenseNumber;
    this.oInstructorRequestDto.yearsOfExperience = Number(getSelectedItem.yearsOfExperience);
    this.oInstructorRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oInstructorRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.instructorGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.instructorId = Number(getSelectedItem.id);
    this.oInstructorRequestDto.name = getSelectedItem.name;
    this.oInstructorRequestDto.email = getSelectedItem.email;
    this.oInstructorRequestDto.phone = getSelectedItem.phone;
    this.oInstructorRequestDto.address = getSelectedItem.address;
    this.oInstructorRequestDto.userId = getSelectedItem.userId;
    this.oInstructorRequestDto.licenseNumber = getSelectedItem.licenseNumber;
    this.oInstructorRequestDto.yearsOfExperience = Number(getSelectedItem.yearsOfExperience);
    this.oInstructorRequestDto.isActive = getSelectedItem.isActive;
    this.oInstructorRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetInstructor();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetInstructor();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetInstructor();
    }
  }


}
