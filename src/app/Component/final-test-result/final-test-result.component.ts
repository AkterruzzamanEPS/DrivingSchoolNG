import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { FinalTestResultRequestDto, FinalTestResultFilterRequestDto } from '../../Model/FinalTestResult';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-final-test-result',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './final-test-result.component.html',
  styleUrl: './final-test-result.component.scss',
  providers: [DatePipe]
})
export class FinalTestResultComponent  implements OnInit, AfterViewInit {

  private finaltestresultGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public instructorList: any[] = [];

  public slotFromList: any[] = [];
  public instructorFromList: any[] = [];

  public oFinalTestResultRequestDto = new FinalTestResultRequestDto();
  public oFinalTestResultFilterRequestDto = new FinalTestResultFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public testDate: any = "";
  public evaluatedDate: any = "";

  public finaltestresultId = 0;
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
          const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    this.startDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.testDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.evaluatedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetFinalTestResult();
  }


  ngOnInit(): void {
    this.GetAllInstructores();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.finaltestresultGridApi = params.api;
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
    this.GetFinalTestResult();
  }

  private GetFinalTestResult() {

    this.oFinalTestResultFilterRequestDto.startDate = new Date(this.startDate);
    this.oFinalTestResultFilterRequestDto.endDate = new Date(this.endDate);
    this.oFinalTestResultFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oFinalTestResultFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FinalTestResult/GetFinalTestResult?pageNumber=${this.pageIndex}`, this.oFinalTestResultFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.finaltestresultGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAllSlotes() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Slot/GetAllSlotes?StartDate=`).subscribe(
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


  public InsertFinalTestResult() {
    this.oFinalTestResultRequestDto.studentId = Number(this.oFinalTestResultRequestDto.studentId);
    this.oFinalTestResultRequestDto.testType = Number(this.oFinalTestResultRequestDto.testType);
    this.oFinalTestResultRequestDto.score = Number(this.oFinalTestResultRequestDto.score);
    this.oFinalTestResultRequestDto.testDate = new Date(this.testDate);
    this.oFinalTestResultRequestDto.evaluatedDate = new Date(this.evaluatedDate);
    this.oFinalTestResultRequestDto.passed = CommonHelper.booleanConvert(this.oFinalTestResultRequestDto.passed);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(this.oFinalTestResultRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FinalTestResult/InsertFinalTestResult`, this.oFinalTestResultRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetFinalTestResult();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateFinalTestResult() {
     this.oFinalTestResultRequestDto.studentId = Number(this.oFinalTestResultRequestDto.studentId);
    this.oFinalTestResultRequestDto.testType = Number(this.oFinalTestResultRequestDto.testType);
    this.oFinalTestResultRequestDto.score = Number(this.oFinalTestResultRequestDto.score);
    this.oFinalTestResultRequestDto.testDate = new Date(this.testDate);
    this.oFinalTestResultRequestDto.evaluatedDate = new Date(this.evaluatedDate);
    this.oFinalTestResultRequestDto.passed = CommonHelper.booleanConvert(this.oFinalTestResultRequestDto.passed);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(this.oFinalTestResultRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FinalTestResult/UpdateFinalTestResult/${this.finaltestresultId}`, this.oFinalTestResultRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetFinalTestResult();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteFinalTestResult() {
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(this.oFinalTestResultRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`FinalTestResult/DeleteFinalTestResult/${this.finaltestresultId}`, this.oFinalTestResultRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetFinalTestResult();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oFinalTestResultRequestDto = new FinalTestResultRequestDto();
    this.finaltestresultId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.finaltestresultGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.finaltestresultId = Number(getSelectedItem.id);
    this.oFinalTestResultRequestDto.studentId = Number(getSelectedItem.studentId);
    this.oFinalTestResultRequestDto.instruction = getSelectedItem.instruction;
    this.oFinalTestResultRequestDto.evaluatedBy = getSelectedItem.evaluatedBy;
    this.oFinalTestResultRequestDto.testType = Number(getSelectedItem.testType);
    this.oFinalTestResultRequestDto.score = Number(getSelectedItem.score);
    this.oFinalTestResultRequestDto.testDate = new Date(getSelectedItem.testDate);
    this.oFinalTestResultRequestDto.evaluatedDate = new Date(getSelectedItem.evaluatedDate);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oFinalTestResultRequestDto.passed = CommonHelper.booleanConvert(getSelectedItem.passed);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oFinalTestResultRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.finaltestresultGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.finaltestresultId = Number(getSelectedItem.id);
    this.oFinalTestResultRequestDto.studentId = Number(getSelectedItem.studentId);
    this.oFinalTestResultRequestDto.instruction = getSelectedItem.instruction;
    this.oFinalTestResultRequestDto.evaluatedBy = getSelectedItem.evaluatedBy;
    this.oFinalTestResultRequestDto.testType = Number(getSelectedItem.testType);
    this.oFinalTestResultRequestDto.score = Number(getSelectedItem.score);
    this.oFinalTestResultRequestDto.testDate = new Date(getSelectedItem.testDate);
    this.oFinalTestResultRequestDto.evaluatedDate = new Date(getSelectedItem.evaluatedDate);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oFinalTestResultRequestDto.passed = CommonHelper.booleanConvert(getSelectedItem.passed);
    this.oFinalTestResultRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oFinalTestResultRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetFinalTestResult();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetFinalTestResult();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetFinalTestResult();
    }
  }


}


