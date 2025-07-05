import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { StudentFilterRequestDto, StudentRequestDto } from '../../Model/Student';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  providers: [DatePipe]
})
export class StudentComponent implements OnInit {

  private studentGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public studentList: any[] = [];
  public userList: any[] = [];
  public oStudentFilterRequestDto = new StudentFilterRequestDto();
  public oStudentRequestDto = new StudentRequestDto();

  public studentId = 0;
  public dateOfBirth: any;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'studentIdNo', width: 150, headerName: 'IdNo', filter: true },
    { field: 'name', width: 150, headerName: 'Name', filter: true },
    { field: 'phone', width: 150, headerName: 'Phone', filter: true },
    { field: 'packageName', width: 150, headerName: 'Package', filter: true },
    { field: 'nooflesson', width: 150, headerName: 'Lessons', filter: true },
    { field: 'completeLesson', width: 150, headerName: 'Complete Lessons', filter: true },
    { field: 'remainingLesson', width: 150, headerName: 'Remaining Lessons', filter: true },
    { field: 'learningStageName', width: 150, headerName: 'Learning Stage', filter: true },
    { field: 'netAmount', width: 150, headerName: 'Net Amount', filter: true },
    { field: 'remainingAmount', width: 150, headerName: 'Remaining Amount', filter: true },
    { field: 'paymentAmount', width: 150, headerName: 'Payment Amount', filter: true },
    { field: 'slotAssign', headerName: 'Slot Assign', width: 120, pinned: "right", resizable: true, cellRenderer: this.SlotAssignToGrid.bind(this) },
    { field: 'slotAssign', headerName: 'Detail', width: 120, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByStudent: TrackByFunction<any> | any;
  trackByStudentFrom: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.GetAspNetUsersByType();
    this.GetStudent();
  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetStudent();
  }

  onGridReadyTransection(params: any) {
    this.studentGridApi = params.api;
    this.rowData = [];
  }

  SlotAssignToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Slot Assign</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/lesson/' + params.data.id)
    });
    return eDiv;
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/student-detail/' + params.data.id)
    });
    return eDiv;
  }


  Filter() {
    this.GetStudent();
  }

  private GetStudent() {
    this.oStudentFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oStudentFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Student/GetStudent?pageNumber=${this.pageIndex}`, this.oStudentFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        // this.studentGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  private GetAspNetUsersByType() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`AspNetUsers/GetAspNetUsersByType?Type=4`).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public InsertStudent() {
    if (this.oStudentRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oStudentRequestDto.dateOfBirth = new Date(this.dateOfBirth);
    this.oStudentRequestDto.learningStage = Number(this.oStudentRequestDto.learningStage);
    this.oStudentRequestDto.isActive = CommonHelper.booleanConvert(this.oStudentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Student/InsertStudent`, this.oStudentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetStudent();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateStudent() {

    if (this.oStudentRequestDto.name == "") {
      this.toast.warning("Please enter name", "Warning!!", { progressBar: true });
      return;
    }
    this.oStudentRequestDto.isActive = CommonHelper.booleanConvert(this.oStudentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Student/UpdateStudent/${this.studentId}`, this.oStudentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetStudent();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteStudent() {
    this.oStudentRequestDto.isActive = CommonHelper.booleanConvert(this.oStudentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Student/DeleteStudent/${this.studentId}`, this.oStudentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetStudent();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oStudentRequestDto = new StudentRequestDto();
    this.studentId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.studentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.studentId = Number(getSelectedItem.id);
    this.oStudentRequestDto.name = getSelectedItem.name;
    this.oStudentRequestDto.email = getSelectedItem.email;
    this.oStudentRequestDto.phone = getSelectedItem.phone;
    this.oStudentRequestDto.address = getSelectedItem.address;
    this.oStudentRequestDto.userId = getSelectedItem.userId;
    this.oStudentRequestDto.dateOfBirth = getSelectedItem.dateOfBirth;
    this.oStudentRequestDto.learningStage = Number(getSelectedItem.learningStage);
    this.oStudentRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oStudentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.studentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.studentId = Number(getSelectedItem.id);
    this.oStudentRequestDto.name = getSelectedItem.name;
    this.oStudentRequestDto.email = getSelectedItem.email;
    this.oStudentRequestDto.phone = getSelectedItem.phone;
    this.oStudentRequestDto.address = getSelectedItem.address;
    this.oStudentRequestDto.userId = getSelectedItem.userId;
    this.oStudentRequestDto.dateOfBirth = getSelectedItem.dateOfBirth;
    this.oStudentRequestDto.learningStage = Number(getSelectedItem.learningStage);
    this.oStudentRequestDto.isActive = getSelectedItem.isActive;
    this.oStudentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetStudent();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetStudent();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetStudent();
    }
  }


}
