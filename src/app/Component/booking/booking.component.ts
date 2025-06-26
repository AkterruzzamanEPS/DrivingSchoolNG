import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { BookingRequestDto, BookingFilterRequestDto } from '../../Model/Booking';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [DatePipe]
})
export class BookingComponent implements OnInit, AfterViewInit {

  private bookingGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];
  public vehicleList: any[] = [];
  public studentList: any[] = [];

  public oBookingRequestDto = new BookingRequestDto();
  public oBookingFilterRequestDto = new BookingFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public classDate: any = "";

  public bookingId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'userName', width: 150, headerName: 'Student Name', filter: true },
    { field: 'instructorName', width: 150, headerName: 'Instructor Name', filter: true },
    {
      field: 'classDate', width: 150, headerName: 'Lesson Date', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.classDate, 'MMM d, y')
    },
    {
      field: 'classDate', width: 150, headerName: 'Day', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.classDate, 'EEEE')
    },
    { field: 'slotName', width: 150, headerName: 'Slot Name', filter: true },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
    { field: 'statusName', headerName: 'Status' },
    { field: '', headerName: 'Progress', width: 120, pinned: "right", resizable: true, cellRenderer: this.progressToGrid.bind(this) },
    { field: '', headerName: 'Detail', width: 120, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },

  ];
  trackByFn: TrackByFunction<any> | any;
  trackBySlot: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByvehicleFrom: TrackByFunction<any> | any;

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
    this.classDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetAllStudentes();
    this.GetBooking();
  }


  ngOnInit(): void {
    this.GetAllInstructores();
    this.GetAllSlotes();
    this.GetAllVehicles();

  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetBooking();
  }


  private GetAllStudentes() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Student/GetAllStudentes`).subscribe(
      (res: any) => {
        this.studentList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  onGridReadyTransection(params: any) {
    this.bookingGridApi = params.api;
    this.rowData = [];
  }

  progressToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Progress</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/lesson-progres/' + params.data.id)
    });
    return eDiv;
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/progres-detail/' + params.data.id)
    });
    return eDiv;
  }


  Filter() {
    this.GetBooking();
  }

  private GetBooking() {
    this.oBookingFilterRequestDto.startDate = new Date(this.startDate);
    this.oBookingFilterRequestDto.endDate = new Date(this.endDate);
    this.oBookingFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/GetBooking?pageNumber=${this.pageIndex}`, this.oBookingFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        // this.bookingGridApi.sizeColumnsToFit();
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
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAllVehicles() {
    this.http.Get(`Vehicle/GetAllVehicles`).subscribe(
      (res: any) => {
        this.vehicleList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertBooking() {
    this.oBookingRequestDto.slotId = Number(this.oBookingRequestDto.slotId);
    this.oBookingRequestDto.instructorId = Number(this.oBookingRequestDto.instructorId);
    this.oBookingRequestDto.vehicleId = Number(this.oBookingRequestDto.vehicleId);
    this.oBookingRequestDto.status = Number(this.oBookingRequestDto.status);
    this.oBookingRequestDto.classDate = new Date(this.classDate);
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRequestDto.isActive);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/InsertBooking`, this.oBookingRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetBooking();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateBooking() {
    this.oBookingRequestDto.slotId = Number(this.oBookingRequestDto.slotId);
    this.oBookingRequestDto.instructorId = Number(this.oBookingRequestDto.instructorId);
    this.oBookingRequestDto.vehicleId = Number(this.oBookingRequestDto.vehicleId);
    this.oBookingRequestDto.status = Number(this.oBookingRequestDto.status);
    this.oBookingRequestDto.classDate = new Date(this.classDate);

    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/UpdateBooking/${this.bookingId}`, this.oBookingRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetBooking();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteBooking() {
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/DeleteBooking/${this.bookingId}`, this.oBookingRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetBooking();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/lesson-atecre/' + 0)
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.bookingGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.bookingId = Number(getSelectedItem.id);
    this.oBookingRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oBookingRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oBookingRequestDto.vehicleId = Number(getSelectedItem.vehicleId);
    this.oBookingRequestDto.classDate = new Date(getSelectedItem.classDate);
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oBookingRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.bookingGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.bookingId = Number(getSelectedItem.id);
    this.oBookingRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oBookingRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oBookingRequestDto.vehicleId = Number(getSelectedItem.vehicleId);
    this.oBookingRequestDto.classDate = new Date(getSelectedItem.classDate);
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oBookingRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetBooking();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetBooking();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetBooking();
    }
  }


}

