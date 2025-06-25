import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AttendanceRequestDto, AttendanceFilterRequestDto } from '../../Model/Attendance';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
  providers: [DatePipe]
})
export class AttendanceComponent  implements OnInit, AfterViewInit {

  private attendanceGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];

  public slotFromList: any[] = [];
  public instructorFromList: any[] = [];

  public oAttendanceRequestDto = new AttendanceRequestDto();
  public oAttendanceFilterRequestDto = new AttendanceFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public markDate: any = "";

  public attendanceId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'slotName', width: 150, headerName: 'Slot Name', filter: true },
    { field: 'instructorName', width: 150, headerName: 'Instructor Name', filter: true },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackBySlot: TrackByFunction<any> | any;
  trackBySlotFrom: TrackByFunction<any> | any;

  trackByInstructor: TrackByFunction<any> | any;
  trackByInstructorFrom: TrackByFunction<any> | any;

  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
          const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.markDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetAttendance();
  }


  ngOnInit(): void {
    this.GetAllInstructores();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.attendanceGridApi = params.api;
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
    this.GetAttendance();
  }

  private GetAttendance() {

    this.oAttendanceFilterRequestDto.startDate = new Date(this.startDate);
    this.oAttendanceFilterRequestDto.endDate = new Date(this.endDate);
    this.oAttendanceFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oAttendanceFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Attendance/GetAttendance?pageNumber=${this.pageIndex}`, this.oAttendanceFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.attendanceGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAllSlotes() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Slot/GetAllSlotes`).subscribe(
      (res: any) => {
        this.slotList = res;
        this.slotFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  private GetAllInstructores() {
    this.http.Get(`Instructor/GetAllInstructores`).subscribe(
      (res: any) => {
        this.instructorList = res;
        this.instructorFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertAttendance() {
    this.oAttendanceRequestDto.bookingId = Number(this.oAttendanceRequestDto.bookingId);
    this.oAttendanceRequestDto.markDate = new Date(this.markDate);
    this.oAttendanceRequestDto.attended = CommonHelper.booleanConvert(this.oAttendanceRequestDto.attended);
    this.oAttendanceRequestDto.isActive = CommonHelper.booleanConvert(this.oAttendanceRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Attendance/InsertAttendance`, this.oAttendanceRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAttendance();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateAttendance() {
      this.oAttendanceRequestDto.bookingId = Number(this.oAttendanceRequestDto.bookingId);
    this.oAttendanceRequestDto.markDate = new Date(this.markDate);
    this.oAttendanceRequestDto.attended = CommonHelper.booleanConvert(this.oAttendanceRequestDto.attended);
    this.oAttendanceRequestDto.isActive = CommonHelper.booleanConvert(this.oAttendanceRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Attendance/UpdateAttendance/${this.attendanceId}`, this.oAttendanceRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAttendance();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteAttendance() {
    this.oAttendanceRequestDto.isActive = CommonHelper.booleanConvert(this.oAttendanceRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Attendance/DeleteAttendance/${this.attendanceId}`, this.oAttendanceRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetAttendance();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oAttendanceRequestDto = new AttendanceRequestDto();
    this.attendanceId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.attendanceGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.attendanceId = Number(getSelectedItem.id);
    this.oAttendanceRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oAttendanceRequestDto.markDate = new Date(getSelectedItem.markDate);
    this.oAttendanceRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oAttendanceRequestDto.attended = CommonHelper.booleanConvert(getSelectedItem.attended);
    this.oAttendanceRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.attendanceGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.oAttendanceRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oAttendanceRequestDto.markDate = new Date(getSelectedItem.markDate);
    this.oAttendanceRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oAttendanceRequestDto.attended = CommonHelper.booleanConvert(getSelectedItem.attended);
    this.oAttendanceRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetAttendance();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetAttendance();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetAttendance();
    }
  }


}


