import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { SlotAssignmentRequestDto, SlotAssignmentFilterRequestDto } from '../../Model/SlotAssignment';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-slot-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './slot-assignment.component.html',
  styleUrl: './slot-assignment.component.scss',
  providers: [DatePipe]
})
export class SlotAssignmentComponent implements OnInit, AfterViewInit {

  private slotassignmentGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];

  public slotFromList: any[] = [];
  public instructorFromList: any[] = [];

  public oSlotAssignmentRequestDto = new SlotAssignmentRequestDto();
  public oSlotAssignmentFilterRequestDto = new SlotAssignmentFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public availableDate: any = "";

  public slotassignmentId = 0;
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
    { field: 'availableDate', width: 150, headerName: 'Available Date', filter: true },
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
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    // Format dates using DatePipe
    this.startDate = this.datePipe.transform(oneMonthAgo, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.availableDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetSlotAssignment();
  }


  ngOnInit(): void {
    this.GetAllInstructores();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.slotassignmentGridApi = params.api;
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
    this.GetSlotAssignment();
  }

  private GetSlotAssignment() {

    this.oSlotAssignmentFilterRequestDto.startDate = new Date(this.startDate);
    this.oSlotAssignmentFilterRequestDto.endDate = new Date(this.endDate);
    this.oSlotAssignmentFilterRequestDto.instructorId = Number(this.oSlotAssignmentFilterRequestDto.instructorId);
    this.oSlotAssignmentFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotAssignmentFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`SlotAssignment/GetSlotAssignment?pageNumber=${this.pageIndex}`, this.oSlotAssignmentFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.slotassignmentGridApi.sizeColumnsToFit();
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


  public InsertSlotAssignment() {
    this.oSlotAssignmentRequestDto.slotId = Number(this.oSlotAssignmentRequestDto.slotId);
    this.oSlotAssignmentRequestDto.instructorId = Number(this.oSlotAssignmentRequestDto.instructorId);
    this.oSlotAssignmentRequestDto.availableDate = new Date(this.oSlotAssignmentRequestDto.availableDate);
    // After the hash is generated, proceed with the API call
    this.http.Post(`SlotAssignment/InsertSlotAssignment`, this.oSlotAssignmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetSlotAssignment();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateSlotAssignment() {
    this.oSlotAssignmentRequestDto.slotId = Number(this.oSlotAssignmentRequestDto.slotId);
    this.oSlotAssignmentRequestDto.instructorId = Number(this.oSlotAssignmentRequestDto.instructorId);

    this.oSlotAssignmentRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotAssignmentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`SlotAssignment/UpdateSlotAssignment/${this.slotassignmentId}`, this.oSlotAssignmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetSlotAssignment();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteSlotAssignment() {
    this.oSlotAssignmentRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotAssignmentRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`SlotAssignment/DeleteSlotAssignment/${this.slotassignmentId}`, this.oSlotAssignmentRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetSlotAssignment();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oSlotAssignmentRequestDto = new SlotAssignmentRequestDto();
    this.slotassignmentId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.slotassignmentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.slotassignmentId = Number(getSelectedItem.id);
    this.oSlotAssignmentRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oSlotAssignmentRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oSlotAssignmentRequestDto.availableDate = new Date(getSelectedItem.availableDate);
    this.oSlotAssignmentRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oSlotAssignmentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.slotassignmentGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.slotassignmentId = Number(getSelectedItem.id);
    this.oSlotAssignmentRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oSlotAssignmentRequestDto.instructorId = Number(getSelectedItem.instructorId);
    this.oSlotAssignmentRequestDto.availableDate = new Date(getSelectedItem.availableDate);
    this.oSlotAssignmentRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oSlotAssignmentRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetSlotAssignment();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetSlotAssignment();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetSlotAssignment();
    }
  }


}

