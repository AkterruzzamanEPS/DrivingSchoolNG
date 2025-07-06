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

  public slotList: any[] = [];
  public instructorList: any[] = [];

  public oLessonProgresRequestDto = new LessonProgresRequestDto();
  public oLessonProgresFilterRequestDto = new LessonProgresFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public addedDate: any = "";

  public lessonprogresId = 0;
  public bookingId = 0;
  // pagination setup


  public oBookingResponseDto: any;

  trackByFn: TrackByFunction<any> | any;
  trackBySlot: TrackByFunction<any> | any;
  trackBySlotFrom: TrackByFunction<any> | any;
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

  }


  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.bookingId = Number(id);
      this.GetBookingById();
    }

  }



  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
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
    this.oLessonProgresRequestDto.status = Number(this.oLessonProgresRequestDto.status);
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

  BackToList() {
    this.router.navigateByUrl('admin/lesson')
  }


  public UpdateLessonProgres() {
    this.oLessonProgresRequestDto.bookingId = Number(this.oLessonProgresRequestDto.bookingId);
    this.oLessonProgresRequestDto.progressPercentage = Number(this.oLessonProgresRequestDto.progressPercentage);
    this.oLessonProgresRequestDto.status = Number(this.oLessonProgresRequestDto.status);
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




}