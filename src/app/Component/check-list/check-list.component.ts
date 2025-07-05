import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { CheckListFilterRequestDto, CheckListRequestDto } from '../../Model/CheckList';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './check-list.component.html',
  styleUrl: './check-list.component.scss',
  providers: [DatePipe]
})
export class CheckListComponent implements OnInit {

  private CheckListGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public oCheckListFilterRequestDto = new CheckListFilterRequestDto();
  public oCheckListRequestDto = new CheckListRequestDto();

  public startDate: any;
  public endDate: any;
  public CheckListId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'name', width: 150, headerName: 'Name', filter: true },
    { field: 'description', width: 150, headerName: 'Description', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
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
    this.GetCheckList();
  }

  onGridReadyTransection(params: any) {
    this.CheckListGridApi = params.api;
    this.rowData = [];
  }

  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/checklist/' + params.data.id)
    });
    return eDiv;
  }

  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.CheckListId = Number(params.data.id);
       this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }

  Filter() {
    this.GetCheckList();
  }

  private GetCheckList() {
    this.oCheckListFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oCheckListFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`CheckList/GetCheckList?pageNumber=${this.pageIndex}`, this.oCheckListFilterRequestDto).subscribe(
      (res: any) => {
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.CheckListGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteCheckList() {
    this.oCheckListRequestDto.isActive = CommonHelper.booleanConvert(this.oCheckListRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`CheckList/DeleteCheckList/${this.CheckListId}`, this.oCheckListRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetCheckList();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/checklist/' + 0)
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.CheckListGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.CheckListId = Number(getSelectedItem.id);
    this.oCheckListRequestDto.name = getSelectedItem.name;
    this.oCheckListRequestDto.isActive = getSelectedItem.isActive;
    this.oCheckListRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetCheckList();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetCheckList();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetCheckList();
    }
  }


}

