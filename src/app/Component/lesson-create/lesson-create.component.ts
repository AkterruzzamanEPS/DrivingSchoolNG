import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { BookingAssignRequestDto, BookingFilterRequestDto, BookingRequestDto, StudentResponseDto } from '../../Model/Booking';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-lesson-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lesson-create.component.html',
  styleUrl: './lesson-create.component.scss',
  providers: [DatePipe]
})
export class LessonCreateComponent implements OnInit, AfterViewInit {


  private bookingSlotGridApi!: any;
  private dayGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public rowDataDay!: any[];
  public rowDataBookingSlot!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];
  public vehicleList: any[] = [];
  public studentList: any[] = [];

  public oBookingAssignRequestDto = new BookingAssignRequestDto();
  public oBookingFilterRequestDto = new BookingFilterRequestDto();
  public oStudentResponseDto = new StudentResponseDto();
  public oBookingRequestDto = new BookingRequestDto();

  public purchaseDate: any = "";
  public expiryDate: any = "";
  public packageStartDate: any = "";
  public dayList: any[] = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  public bookingId = 0;
  // pagination setup

  public colDefsBookingSlot: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'date', width: 150, headerName: 'Lesson Date', filter: true },
    { field: 'day', width: 150, headerName: 'Day', filter: true },
    { field: 'slotName', headerName: 'Slot' },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
  ];

  public colDefsDay: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: true },
    { field: 'name', width: 150, headerName: 'Day', filter: true },
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
    private cdr: ChangeDetectorRef,// <-- Inject here
    private datePipe: DatePipe) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.purchaseDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.expiryDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.packageStartDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetAllStudentes();
    this.rowDataDay = this.dayList;
  }


  ngOnInit(): void {

    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.bookingId = Number(id);
      if (this.bookingId > 0) {
        this.GetBookingById();
      }
    }
    this.GetAllSlotes();
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
    this.rowDataDay = [];
    this.rowDataDay = this.dayList;
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

  changeStuden(event: any) {
    this.GetStudentById();
  }

  GeneratedBookingSlot() {
    const startDate = new Date(this.packageStartDate); // Wednesday
    let days: any = [];

    let getSelectedDay = AGGridHelper.GetSelectedRows(this.dayGridApi);
    if (getSelectedDay.length == 0) {
      this.toast.warning("Please select days", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oBookingAssignRequestDto.slotId == 0) {
      this.toast.warning("Please select slot", "Warning!!", { progressBar: true });
      return;
    }
    getSelectedDay.forEach(x => {
      days.push(x.name);
    })
    const lessonCount = this.oStudentResponseDto.totalLessons;
    const findSlot = this.slotList.find(x => x.id == this.oBookingAssignRequestDto.slotId);
    const lessonSlots = CommonHelper.getLessonSlots(startDate, days, lessonCount, findSlot);
    this.rowDataBookingSlot = lessonSlots;
  }
  private GetStudentById() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Student/GetStudentById/${this.oBookingAssignRequestDto.studentId}`).subscribe(
      (res: any) => {
        this.oStudentResponseDto = res as StudentResponseDto;
        this.cdr.detectChanges(); // 👈 Force change detection
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

  BackToList() {
    this.router.navigateByUrl('admin/lesson')
  }


  private GetBookingById() {
    this.http.Get(`Booking/GetBookingById/${this.bookingId}`).subscribe(
      (res: any) => {
        this.oBookingRequestDto = res;
        this.oBookingAssignRequestDto.studentId = Number(this.oBookingRequestDto.studentId);
        this.oBookingAssignRequestDto.slotId = Number(this.oBookingRequestDto.slotId);
        this.packageStartDate = this.datePipe.transform(new Date(this.oBookingRequestDto.classDate), 'yyyy-MM-dd');
        if (this.oBookingAssignRequestDto.studentId > 0) {
          this.GetStudentById();
        }
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  ConfirmBookingSlot() {
    this.oBookingAssignRequestDto.studentId = Number(this.oBookingAssignRequestDto.studentId);
    this.oBookingAssignRequestDto.slotId = Number(this.oBookingAssignRequestDto.slotId);
    this.oBookingAssignRequestDto.userId = this.oStudentResponseDto.userId;
    this.oBookingAssignRequestDto.packageId = Number(this.oStudentResponseDto.packageId);
    this.oBookingAssignRequestDto.status = this.oBookingAssignRequestDto.studentId > 0 ? 2 : 1;
    this.oBookingAssignRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oBookingAssignRequestDto.packageStartDate = new Date(this.packageStartDate);
    this.oBookingAssignRequestDto.classDate = new Date(this.packageStartDate);
    this.oBookingAssignRequestDto.expiryDate = new Date(this.expiryDate);
    this.oBookingAssignRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingAssignRequestDto.isActive);
    this.oBookingAssignRequestDto.slots = AGGridHelper.GetRows(this.bookingSlotGridApi);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/StudentSlotAssign`, this.oBookingAssignRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public InsertBooking() {
    debugger
    this.oBookingAssignRequestDto.slotId = Number(this.oBookingAssignRequestDto.slotId);
    this.oBookingAssignRequestDto.status = Number(Number(this.oBookingAssignRequestDto.studentId) == 0 ? 1 : 2);
    this.oBookingAssignRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oBookingAssignRequestDto.packageStartDate = new Date(this.packageStartDate);
    this.oBookingAssignRequestDto.classDate = new Date(this.packageStartDate);
    this.oBookingAssignRequestDto.expiryDate = new Date(this.expiryDate);
    this.oBookingAssignRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingAssignRequestDto.isActive);

    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/InsertBooking`, this.oBookingAssignRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.error, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateBooking() {
    this.oBookingAssignRequestDto.slotId = Number(this.oBookingAssignRequestDto.slotId);
    this.oBookingAssignRequestDto.status = Number(this.oBookingAssignRequestDto.studentId == 0 ? 1 : 2);
    this.oBookingAssignRequestDto.purchaseDate = new Date(this.purchaseDate);
    this.oBookingAssignRequestDto.classDate = new Date(this.packageStartDate);
    this.oBookingAssignRequestDto.expiryDate = new Date(this.expiryDate);

    this.oBookingAssignRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingAssignRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/UpdateBooking/${this.bookingId}`, this.oBookingAssignRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");

        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteBooking() {
    this.oBookingAssignRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingAssignRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Booking/DeleteBooking/${this.bookingId}`, this.oBookingAssignRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");

        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


}

