import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { LessonProgresRequestDto, LessonProgresFilterRequestDto } from '../../Model/LessonProgres';
import { BookingCheckListRequestDto } from '../../Model/BookingChecklist';
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
  public CheckList: any[] = [];
    public DeafultCol = AGGridHelper.DeafultCol;
    public nCHeckListId = 0;
    public BookingCheckListId = 0;
    public gridApi!: any;  
  public gridApiUnassign!: any;   
    
    public rowData: any[] = [];
    public rowDataUnassign: any[] = [];

  public oLessonProgresRequestDto = new LessonProgresRequestDto();
  public oBookingCheckListRequestDto = new BookingCheckListRequestDto();
  public oLessonProgresFilterRequestDto = new LessonProgresFilterRequestDto();

  public startDate: any = "";
  public remarks: any = "";
  public endDate: any = "";
  public addedDate: any = "";

  public lessonprogresId = 0;
  public bookingId = 0;
  // pagination setup


  public oBookingResponseDto: any;

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'checkListName', width: 200, headerName: 'Check List', filter: true },
  ];
   
  public colDefsUnAssign: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', width: 200, headerName: 'Check List', filter: true },
  ];


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
    this.GetCheckList();
  }


   private GetCheckList() {
      
      // After the hash is generated, proceed with the API call
      this.http.Get(`CheckList/GetAllCheckListes`).subscribe(
        (res: any) => {
          this.CheckList = res;
          this.GetBookingCheckListByBookingId();
        },
        (err) => {
          this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
        }
      );
  
    }
  

  detailToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-eye-fill"></i> Detail</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('transactions/' + params.data.transactionId)
    });
    return eDiv;
  }
    
  onGridReadyTransection(params: any) {
    this.gridApi = params.api;
    this.gridApi.forEachNode((node: any) => {      
      node.setSelected(true);      
    });
  }
  
  UnassignSelectionChange()
  {
    const selectedRows = this.gridApiUnassign.getSelectedRows();
    if (selectedRows.length > 0) {
      this.nCHeckListId = selectedRows[0].id;
      this.remarks = '';
      this.AddCheckList();
    }
  }
  AssignSelectionChange() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.BookingCheckListId = selectedRows[0].id;
      this.oBookingCheckListRequestDto.bookingId = Number(selectedRows[0].bookingId);
      this.oBookingCheckListRequestDto.checkListId = Number(selectedRows[0].checkListId);
      this.oBookingCheckListRequestDto.checkListName = selectedRows[0].checkListName;
      this.oBookingCheckListRequestDto.remarks = selectedRows[0].remarks;
      this.oBookingCheckListRequestDto.isActive =  selectedRows[0].isActive;
      this.DeleteBookingCheckList();
    }
  }

  onGridReady(params: any) {
    this.gridApiUnassign = params.api;
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

  private GetBookingCheckListByBookingId() {
    this.http.Get(`BookingCheckList/GetBookingCheckListByBookingId/${this.bookingId}`).subscribe(
      (res: any) => {
        this.rowData = res;
        this.rowDataUnassign.filter(x => x.id == true);
        let excludedIds = this.rowData.map(item => item.checkListId);
        this.rowDataUnassign = this.CheckList.filter(x => !excludedIds.includes(x.id));
        if(this.gridApi){
          this.gridApi.sizeColumnsToFit();
          this.gridApi.forEachNode((node: any) => {
            node.setSelected(true);
          });
        }
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

  public DeleteBookingCheckList() {
     this.http.Post(`BookingCheckList/DeleteBookingCheckList/${this.BookingCheckListId}`, this.oBookingCheckListRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetBookingCheckListByBookingId();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public AddCheckList(){
    this.oBookingCheckListRequestDto.bookingId = Number(this.bookingId);
    this.oBookingCheckListRequestDto.checkListId = Number(this.nCHeckListId);
    this.oBookingCheckListRequestDto.checkListName = this.CheckList.find(x => x.id == this.nCHeckListId)?.name || '';
    this.oBookingCheckListRequestDto.remarks = this.remarks;
    this.oBookingCheckListRequestDto.isActive = CommonHelper.booleanConvert(this.oBookingCheckListRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`BookingCheckList/InsertBookingCheckList`, this.oBookingCheckListRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        this.GetBookingCheckListByBookingId();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
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