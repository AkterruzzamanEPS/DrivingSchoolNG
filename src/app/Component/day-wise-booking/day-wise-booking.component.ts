import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { BookingRequestDto, BookingFilterRequestDto } from '../../Model/Booking';
import { PaginationComponent } from '../../Shared/pagination/pagination.component';

@Component({
  selector: 'app-day-wise-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './day-wise-booking.component.html',
  styleUrl: './day-wise-booking.component.scss',
  providers: [DatePipe]
})
export class DayWiseBookingComponent implements OnInit, AfterViewInit {

  private bookingGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public slotList: any[] = [];
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
    { field: 'UserName', width: 150, headerName: 'Student Name', filter: true },
    {
      field: 'ClassDate', width: 150, headerName: 'Lesson Date', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.ClassDate, 'MMM d, y')
    },
    {
      field: 'ClassDate', width: 150, headerName: 'Day', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.ClassDate, 'EEEE')
    },
    { field: 'StartTime', headerName: 'Start Time' },
    { field: 'EndTime', headerName: 'End Time' },
    { field: 'StatusName', headerName: 'Status' },
    { field: '', headerName: 'Assign', width: 120, pinned: "right", resizable: true, cellRenderer: this.progressToGrid.bind(this) },
    { field: '', headerName: 'Register', width: 120, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },

  ];
  trackByFn: TrackByFunction<any> | any;
  trackBySlot: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;

  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe) {
    const currentDate = new Date();
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.classDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetAllStudentes();
  }


  ngOnInit(): void {

    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      const currentDate = new Date(id);
      this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    }
    this.GetAllSlotes();
    this.GetAllStudentes();
    this.GetDayWiseBookings();
  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetDayWiseBookings();
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
  }

  progressToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Assign</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/lesson-progres/' + params.data.id)
    });
    return eDiv;
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Register</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/progres-detail/' + params.data.id)
    });
    return eDiv;
  }

  Filter() {
    this.GetDayWiseBookings();
  }

  private GetDayWiseBookings() {
    this.http.Get(`Booking/GetDayWiseBookings?StartDate=${this.datePipe.transform(this.startDate, 'yyyy-MM-dd')}`).subscribe(
      (res: any) => {
        debugger
        this.rowData = [];
        this.rowData = res;
        this.bookingGridApi.sizeColumnsToFit();
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

  public DeleteBooking() {
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/DeleteBooking/${this.bookingId}`, this.oBookingRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetDayWiseBookings();
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


  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.bookingGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.bookingId = Number(getSelectedItem.id);
    this.oBookingRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oBookingRequestDto.classDate = new Date(getSelectedItem.classDate);
    this.oBookingRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oBookingRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetDayWiseBookings();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetDayWiseBookings();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetDayWiseBookings();
    }
  }


}

