import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ExpenditureHeadFilterRequestDto, ExpenditureHeadRequestDto } from '../../Model/ExpenditureHead';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { PaginationComponent } from "../../Shared/pagination/pagination.component";

@Component({
  selector: 'app-expenditure-head',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, PaginationComponent],
  templateUrl: './expenditure-head.component.html',
  styleUrl: './expenditure-head.component.scss',
  providers: [DatePipe]
})
export class ExpenditureHeadComponent implements OnInit {

  private ExpenditureHeadGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public oExpenditureHeadFilterRequestDto = new ExpenditureHeadFilterRequestDto();
  public oExpenditureHeadRequestDto = new ExpenditureHeadRequestDto();

  public startDate: any;
  public endDate: any;
  public ExpenditureHeadId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'name', width: 150, headerName: 'Expenditure Head', filter: true },
    { field: 'isActive', headerName: 'Status' },
    { field: '', headerName: '', width: 60, pinned: "right", resizable: true, cellRenderer: this.editToGrid.bind(this) },
    { field: '', headerName: '', width: 70, pinned: "right", resizable: true, cellRenderer: this.deleteToGrid.bind(this) },
  ];
  trackByFn: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private cdr: ChangeDetectorRef,// <-- Inject here
    private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    this.GetExpenditureHead();
  }

  PageChange(event: any) {
    this.pageIndex = Number(event);
    this.GetExpenditureHead();
  }

  onGridReadyTransection(params: any) {
    this.ExpenditureHeadGridApi = params.api;
    this.rowData = [];
  }

  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/head/' + params.data.id)
    });
    return eDiv;
  }

  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.ExpenditureHeadId = Number(params.data.id);
       this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }

  Filter() {
    this.GetExpenditureHead();
  }

  private GetExpenditureHead() {
    this.oExpenditureHeadFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureHeadFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ExpenditureHead/GetExpenditureHead?pageNumber=${this.pageIndex}`, this.oExpenditureHeadFilterRequestDto).subscribe(
      (res: any) => {
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.ExpenditureHeadGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteExpenditureHead() {
    this.oExpenditureHeadRequestDto.isActive = CommonHelper.booleanConvert(this.oExpenditureHeadRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`ExpenditureHead/DeleteExpenditureHead/${this.ExpenditureHeadId}`, this.oExpenditureHeadRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetExpenditureHead();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/head/' + 0)
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.ExpenditureHeadGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.ExpenditureHeadId = Number(getSelectedItem.id);
    this.oExpenditureHeadRequestDto.name = getSelectedItem.name;
    this.oExpenditureHeadRequestDto.isActive = getSelectedItem.isActive;
    this.oExpenditureHeadRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetExpenditureHead();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetExpenditureHead();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetExpenditureHead();
    }
  }


}

