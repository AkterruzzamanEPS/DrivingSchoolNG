import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { BookingRescheduleRequestDto, BookingRescheduleFilterRequestDto } from '../../Model/BookingReschedule';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-booking-reschedule',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './booking-reschedule.component.html',
  styleUrl: './booking-reschedule.component.scss',
  providers: [DatePipe]
})
export class BookingRescheduleComponent implements OnInit, AfterViewInit {

  private bookingrescheduleGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public oBookingRescheduleRequestDto = new BookingRescheduleRequestDto();
  public oBookingRescheduleFilterRequestDto = new BookingRescheduleFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public oldClassDate: any = "";
  public newClassDate: any = "";

  public bookingrescheduleId = 0;
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
    this.oldClassDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.newClassDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetBookingReschedule();
  }


  ngOnInit(): void {

  }

  onGridReadyTransection(params: any) {
    this.bookingrescheduleGridApi = params.api;
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
    this.GetBookingReschedule();
  }

  private GetBookingReschedule() {

    this.oBookingRescheduleFilterRequestDto.startDate = new Date(this.startDate);
    this.oBookingRescheduleFilterRequestDto.endDate = new Date(this.endDate);
    this.oBookingRescheduleFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRescheduleFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`BookingReschedule/GetBookingReschedule?pageNumber=${this.pageIndex}`, this.oBookingRescheduleFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.bookingrescheduleGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertBookingReschedule() {
    this.oBookingRescheduleRequestDto.oldClassDate = new Date(this.oldClassDate);
    this.oBookingRescheduleRequestDto.newClassDate = new Date(this.newClassDate);
    this.oBookingRescheduleRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRescheduleRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`BookingReschedule/InsertBookingReschedule`, this.oBookingRescheduleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetBookingReschedule();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateBookingReschedule() {
    this.oBookingRescheduleRequestDto.oldClassDate = new Date(this.oldClassDate);
    this.oBookingRescheduleRequestDto.newClassDate = new Date(this.newClassDate);
    this.oBookingRescheduleRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRescheduleRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`BookingReschedule/UpdateBookingReschedule/${this.bookingrescheduleId}`, this.oBookingRescheduleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetBookingReschedule();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteBookingReschedule() {
    this.oBookingRescheduleRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingRescheduleRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`BookingReschedule/DeleteBookingReschedule/${this.bookingrescheduleId}`, this.oBookingRescheduleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetBookingReschedule();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oBookingRescheduleRequestDto = new BookingRescheduleRequestDto();
    this.bookingrescheduleId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.bookingrescheduleGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.bookingrescheduleId = Number(getSelectedItem.id);
    this.oBookingRescheduleRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oBookingRescheduleRequestDto.oldClassDate = new Date(getSelectedItem.oldClassDate);
    this.oBookingRescheduleRequestDto.newClassDate = new Date(getSelectedItem.newClassDate);
    this.oBookingRescheduleRequestDto.reason = getSelectedItem.reason;
    this.oBookingRescheduleRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oBookingRescheduleRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.bookingrescheduleGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
  this.bookingrescheduleId = Number(getSelectedItem.id);
    this.oBookingRescheduleRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oBookingRescheduleRequestDto.oldClassDate = new Date(getSelectedItem.oldClassDate);
    this.oBookingRescheduleRequestDto.newClassDate = new Date(getSelectedItem.newClassDate);
    this.oBookingRescheduleRequestDto.reason = getSelectedItem.reason;
    this.oBookingRescheduleRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oBookingRescheduleRequestDto.remarks = getSelectedItem.remarks;

    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetBookingReschedule();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetBookingReschedule();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetBookingReschedule();
    }
  }


}

