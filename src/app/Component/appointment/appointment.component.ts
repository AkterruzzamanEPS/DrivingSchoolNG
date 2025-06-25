import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AppointmentFilterRequestDto, AppointmentRequestDto } from '../../Model/Appointment';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
  providers: [DatePipe]
})
export class AppointmentComponent implements OnInit, AfterViewInit {

  private appointmentGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];
  public statusList: any[] = [];

  public slotFromList: any[] = [];
  public instructorFromList: any[] = [];

  public oAppointmentRequestDto = new AppointmentRequestDto();
  public oAppointmentFilterRequestDto = new AppointmentFilterRequestDto();

  public requestedAt: string = "";
  public startDate: string = "";
  public endDate: string = "";

  public appointmentId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'name', width: 150, headerName: 'Appointment Name', filter: true },
    { field: 'subAppointmentName', width: 150, headerName: 'Sub Appointment Name', filter: true },
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
  }

  ngAfterViewInit(): void {
    this.GetAppointment();
  }


  ngOnInit(): void {
    this.GetAllInstructores();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.appointmentGridApi = params.api;
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
    this.GetAppointment();
  }

  private GetAppointment() {

    this.oAppointmentFilterRequestDto.startDate = new Date(this.startDate);
    this.oAppointmentFilterRequestDto.endDate = new Date(this.endDate);
    this.oAppointmentFilterRequestDto.slotId = Number(this.oAppointmentFilterRequestDto.slotId);
    this.oAppointmentFilterRequestDto.instructorId = Number(this.oAppointmentFilterRequestDto.instructorId);
    this.oAppointmentFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oAppointmentFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Appointment/GetAppointment?pageNumber=${this.pageIndex}`, this.oAppointmentFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.appointmentGridApi.sizeColumnsToFit();
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


  public InsertAppointment() {

    if (this.oAppointmentRequestDto.userId == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oAppointmentRequestDto.slotId = Number(this.oAppointmentRequestDto.slotId);
    this.oAppointmentRequestDto.instructorId = Number(this.oAppointmentRequestDto.instructorId);
    this.oAppointmentRequestDto.status = Number(this.oAppointmentRequestDto.status);
    this.oAppointmentRequestDto.requestedAt = new Date(this.oAppointmentRequestDto.requestedAt);
    this.oAppointmentRequestDto.isActive = CommonHelper.booleanConvert(this.oAppointmentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Appointment/InsertAppointment`, this.oAppointmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAppointment();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateAppointment() {

    if (this.oAppointmentRequestDto.userId == "") {
      this.toast.warning("Please select user", "Warning!!", { progressBar: true });
      return;
    }

    this.oAppointmentRequestDto.slotId = Number(this.oAppointmentRequestDto.slotId);
    this.oAppointmentRequestDto.instructorId = Number(this.oAppointmentRequestDto.instructorId);
    this.oAppointmentRequestDto.status = Number(this.oAppointmentRequestDto.status);
    this.oAppointmentRequestDto.requestedAt = new Date(this.oAppointmentRequestDto.requestedAt);

    this.oAppointmentRequestDto.isActive = CommonHelper.booleanConvert(this.oAppointmentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Appointment/UpdateAppointment/${this.appointmentId}`, this.oAppointmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetAppointment();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeleteAppointment() {
    this.oAppointmentRequestDto.isActive = CommonHelper.booleanConvert(this.oAppointmentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Appointment/DeleteAppointment/${this.appointmentId}`, this.oAppointmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetAppointment();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oAppointmentRequestDto = new AppointmentRequestDto();
    this.appointmentId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.appointmentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.appointmentId = Number(getSelectedItem.id);
    this.oAppointmentRequestDto.userId = getSelectedItem.userId;
    this.oAppointmentRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oAppointmentRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oAppointmentRequestDto.status = Number(getSelectedItem.status);
    this.oAppointmentRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oAppointmentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.appointmentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.appointmentId = Number(getSelectedItem.id);
    this.oAppointmentRequestDto.userId = getSelectedItem.userId;
    this.oAppointmentRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oAppointmentRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oAppointmentRequestDto.status = Number(getSelectedItem.status);
    this.oAppointmentRequestDto.isActive = getSelectedItem.isActive;
    this.oAppointmentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetAppointment();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetAppointment();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetAppointment();
    }
  }


}

