import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { LessonProgresRequestDto, LessonProgresFilterRequestDto } from '../../Model/LessonProgres';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-lesson-progres',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './lesson-progres.component.html',
  styleUrl: './lesson-progres.component.scss',
  providers: [DatePipe]
})
export class LessonProgresComponent implements OnInit, AfterViewInit {

  private lessonprogresGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];

  public slotFromList: any[] = [];
  public instructorFromList: any[] = [];

  public oLessonProgresRequestDto = new LessonProgresRequestDto();
  public oLessonProgresFilterRequestDto = new LessonProgresFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public addedDate: any = "";

  public lessonprogresId = 0;
  public bookingId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];
  public oBookingResponseDto: any;
  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'slotName', width: 150, headerName: 'Slot Name', filter: true },
    { field: 'instructorName', width: 150, headerName: 'Instructor Name', filter: true },
    { field: 'lessonTitle', headerName: 'Lesson Title' },
    { field: 'feedback', headerName: 'Feedback' },
    { field: 'progressPercentage', headerName: 'Progress Percentage' },
    { field: 'addedBy', headerName: 'Added By' },
    { field: 'addedDate', headerName: 'Added Date', valueGetter: (params: any) => this.datePipe.transform(params.data.addedDate, 'MMM d, y') },
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
    private route: ActivatedRoute,
    private datePipe: DatePipe) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.addedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetLessonProgres();
  }


  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.bookingId = Number(id);
      this.GetBookingById();
    }
    this.GetAllInstructores();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.lessonprogresGridApi = params.api;
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
    this.GetLessonProgres();
  }

  private GetLessonProgres() {

    this.oLessonProgresFilterRequestDto.startDate = new Date(this.startDate);
    this.oLessonProgresFilterRequestDto.endDate = new Date(this.endDate);
    this.oLessonProgresFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oLessonProgresFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`LessonProgres/GetLessonProgres?pageNumber=${this.pageIndex}`, this.oLessonProgresFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.lessonprogresGridApi.sizeColumnsToFit();
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


  private GetBookingById() {
    this.http.Get(`Booking/GetBookingById/${this.bookingId}`).subscribe(
      (res: any) => {
        this.oBookingResponseDto = res;
        this.oLessonProgresRequestDto.lessonTitle = this.oBookingResponseDto.slotName;
        this.oLessonProgresRequestDto.status = Number(this.oBookingResponseDto.status);
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public InsertLessonProgres() {
    this.oLessonProgresRequestDto.bookingId = Number(this.bookingId);
    this.oLessonProgresRequestDto.progressPercentage = Number(this.oLessonProgresRequestDto.progressPercentage);
    this.oLessonProgresRequestDto.addedDate = new Date(this.addedDate);
    this.oLessonProgresRequestDto.isActive = CommonHelper.booleanConvert(this.oLessonProgresRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`LessonProgres/InsertLessonProgres`, this.oLessonProgresRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateLessonProgres() {
    this.oLessonProgresRequestDto.bookingId = Number(this.oLessonProgresRequestDto.bookingId);
    this.oLessonProgresRequestDto.progressPercentage = Number(this.oLessonProgresRequestDto.progressPercentage);
    this.oLessonProgresRequestDto.addedDate = new Date(this.addedDate);
    this.oLessonProgresRequestDto.isActive = CommonHelper.booleanConvert(this.oLessonProgresRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`LessonProgres/UpdateLessonProgres/${this.lessonprogresId}`, this.oLessonProgresRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }

  public DeleteLessonProgres() {
    this.oLessonProgresRequestDto.isActive = CommonHelper.booleanConvert(this.oLessonProgresRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`LessonProgres/DeleteLessonProgres/${this.lessonprogresId}`, this.oLessonProgresRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetLessonProgres();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oLessonProgresRequestDto = new LessonProgresRequestDto();
    this.lessonprogresId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.lessonprogresGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.lessonprogresId = Number(getSelectedItem.id);
    this.oLessonProgresRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oLessonProgresRequestDto.lessonTitle = getSelectedItem.lessonTitle;
    this.oLessonProgresRequestDto.feedback = getSelectedItem.feedback;
    this.oLessonProgresRequestDto.progressPercentage = Number(getSelectedItem.progressPercentage);
    this.oLessonProgresRequestDto.addedDate = new Date(getSelectedItem.addedDate);
    this.oLessonProgresRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oLessonProgresRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.lessonprogresGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.oLessonProgresRequestDto.bookingId = Number(getSelectedItem.bookingId);
    this.oLessonProgresRequestDto.lessonTitle = getSelectedItem.lessonTitle;
    this.oLessonProgresRequestDto.feedback = getSelectedItem.feedback;
    this.oLessonProgresRequestDto.progressPercentage = Number(getSelectedItem.progressPercentage);
    this.oLessonProgresRequestDto.addedDate = new Date(getSelectedItem.addedDate);
    this.oLessonProgresRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oLessonProgresRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetLessonProgres();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetLessonProgres();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetLessonProgres();
    }
  }


}

