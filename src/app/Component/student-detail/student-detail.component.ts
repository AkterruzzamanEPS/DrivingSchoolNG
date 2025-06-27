import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { BookingAssignRequestDto, BookingFilterRequestDto, StudentResponseDto } from '../../Model/Booking';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ValueFormatterParams } from 'ag-grid-community';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss',
  providers: [DatePipe]
})
export class StudentDetailComponent implements OnInit, AfterViewInit {


  private bookingSlotGridApi!: any;
  private dayGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData: any[] = [];
  public rowDataBookingSlot: any[] = [];
  public studentList: any[] = [];

  public oBookingAssignRequestDto = new BookingAssignRequestDto();
  public oBookingFilterRequestDto = new BookingFilterRequestDto();
  public oStudentResponseDto = new StudentResponseDto();
  public oUserPackageResponse: any = new Object();

  public purchaseDate: any = "";
  public DateofBirthDate: any = "";
  public packageStartDate: any = "";
  public bookingId = 0;
  public studentId = 0;
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
    { field: 'slotName', width: 150, headerName: 'Slot Name', filter: true },
    { field: 'instructorName', width: 150, headerName: 'Instructor Name', filter: true },
    { field: 'vehicleName', width: 150, headerName: 'Vehicle Name', filter: true },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
    { field: 'statusName', headerName: 'Status' },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },

  ];


  public colDefsBookingSlot: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    {
      field: 'classDate', width: 150, headerName: 'Lesson Date', filter: true,
      valueGetter: (params: any) => this.datePipe.transform(params.data.classDate, 'dd MMM yyyy')
    },
    { field: 'classDate', width: 150, headerName: 'Day', filter: true, valueGetter: (params: any) => this.datePipe.transform(params.data.classDate, 'EEEE') },
    { field: 'slotName', headerName: 'Slot' },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
  ];

  public colDefsPayment: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    {
      field: 'transactionDate', cellRenderer: (params: ValueFormatterParams) => {
        return this.datePipe.transform(params.value, 'dd MMM yyyy') || '';
      }, headerName: 'Payment Date'
    },
    { field: 'amount', width: 150, headerName: 'Amount', filter: true },
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
    private route: ActivatedRoute,
    private datePipe: DatePipe) {
    this.DateofBirthDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    // this.GetAllStudentes();
  }


  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.studentId = Number(id);
      this.GetStudentById();
      this.GetUserPackageByStudentId();
      this.GetBookingsByStudentId();
      this.GetPaymentByStudentId();
    }
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

  onGridReadyDay(params: any) {
    this.dayGridApi = params.api;
    this.rowData = [];
  }

  onGridReadyBookingSlot(params: any) {
    this.bookingSlotGridApi = params.api;
    this.rowDataBookingSlot = [];
  }

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }


  private GetStudentById() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Student/GetStudentById/${this.studentId}`).subscribe(
      (res: any) => {
        this.oStudentResponseDto = res;
        this.DateofBirthDate = this.datePipe.transform(this.oStudentResponseDto.dateOfBirth, 'yyyy-MM-dd');

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  private GetUserPackageByStudentId() {
    this.http.Get(`UserPackage/GetUserPackageByStudentId/${this.studentId}`).subscribe(
      (res: any) => {
        this.oUserPackageResponse = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


  private GetBookingsByStudentId() {
    this.http.Get(`Booking/GetBookingByStudentId/${this.studentId}`).subscribe(
      (res: any) => {
        this.rowDataBookingSlot = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  private GetPaymentByStudentId() {
    this.http.Get(`Payment/GetPaymentByStudentId/${this.studentId}`).subscribe(
      (res: any) => {
        this.rowData = res || [];
        console.log(this.rowData);
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


}


