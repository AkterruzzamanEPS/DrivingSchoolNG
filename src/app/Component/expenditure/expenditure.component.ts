import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ExpenditureFilterRequestDto, ExpenditureRequestDto } from '../../Model/Expenditure';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-expenditure',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './expenditure.component.html',
  styleUrl: './expenditure.component.scss',
  providers: [DatePipe]
})
export class ExpenditureComponent implements OnInit {

  private ExpenditureGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public ExpenditureList: any[] = [];
  public oExpenditureFilterRequestDto = new ExpenditureFilterRequestDto();
  public oExpenditureRequestDto = new ExpenditureRequestDto();

  public startDate: any;
  public endDate: any;
  public ExpenditureId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'createdDate', width: 150, headerName: 'Date', filter: true,
       valueGetter: (params: any) => this.datePipe.transform(params.data.createdDate, 'MMM d, y')
     },
    { field: 'name', width: 150, headerName: 'Expenditure', filter: true },
    { field: 'expenditureHeadName', width: 150, headerName: 'Head', filter: true },
    { field: 'amount', width: 150, headerName: 'Amount', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: '', headerName: '', width: 80, pinned: "right", resizable: true, cellRenderer: this.editToGrid.bind(this) },
    { field: '', headerName: '', width:80, pinned: "right", resizable: true, cellRenderer: this.deleteToGrid.bind(this) },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByExpenditure: TrackByFunction<any> | any;
  trackByExpenditureFrom: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private cdr: ChangeDetectorRef,// <-- Inject here
    private datePipe: DatePipe) {
    const today = new Date();
    this.startDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
  }


  ngOnInit(): void {
    this.GetExpenditure();
  }

  onGridReadyTransection(params: any) {
    this.ExpenditureGridApi = params.api;
    this.rowData = [];
  }

  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('expenditure/' + params.data.id)
    });
    return eDiv;
  }
  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = '<button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.ExpenditureId = Number(params.data.id);
       this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }

  Filter() {
    this.GetExpenditure();
  }

  private GetExpenditure() {
    this.oExpenditureFilterRequestDto.startDate = new Date(this.startDate);
    this.oExpenditureFilterRequestDto.endDate = new Date(this.endDate);
    this.oExpenditureFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/GetExpenditure?pageNumber=${this.pageIndex}`, this.oExpenditureFilterRequestDto).subscribe(
      (res: any) => {
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.ExpenditureGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteExpenditure() {
    this.oExpenditureRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Expenditure/DeleteExpenditure/${this.ExpenditureId}`, this.oExpenditureRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetExpenditure();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/expenditure/' + 0)
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.ExpenditureGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.ExpenditureId = Number(getSelectedItem.id);
    this.oExpenditureRequestDto.name = getSelectedItem.name;
    this.oExpenditureRequestDto.isActive = getSelectedItem.isActive;
    this.oExpenditureRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetExpenditure();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetExpenditure();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetExpenditure();
    }
  }


}

