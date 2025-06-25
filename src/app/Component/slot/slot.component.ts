import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { SlotFilterRequestDto, SlotRequestDto } from '../../Model/Slot';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './slot.component.html',
  styleUrl: './slot.component.scss',
  providers: [DatePipe]
})
export class SlotComponent implements OnInit {

  private slotGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oSlotFilterRequestDto = new SlotFilterRequestDto();
  public oSlotRequestDto = new SlotRequestDto();

  public slotId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'name', width: 150, headerName: 'Slot Name', filter: true },
    { field: 'startTime', width: 150, headerName: 'Start Time', filter: true },
    { field: 'endTime', width: 150, headerName: 'End Time', filter: true },
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
    this.GetSlot();
  }

  onGridReadyTransection(params: any) {
    this.slotGridApi = params.api;
    this.rowData = [];
  }


  Filter() {
    this.GetSlot();
  }


  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/slot/' + params.data.id)
    });
    return eDiv;
  }

  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.slotId = Number(params.data.id);
      this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }


  private GetSlot() {
    this.oSlotFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/GetSlot?pageNumber=${this.pageIndex}`, this.oSlotFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.slotGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeleteSlot() {
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/DeleteSlot/${this.slotId}`, this.oSlotRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetSlot();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('/admin/slot/' + 0)
  }


  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.slotGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.slotId = Number(getSelectedItem.id);
    this.oSlotRequestDto.name = getSelectedItem.name;
    this.oSlotRequestDto.startTime = getSelectedItem.startTime;
    this.oSlotRequestDto.endTime = getSelectedItem.endTime;
    this.oSlotRequestDto.isActive = getSelectedItem.isActive;
    this.oSlotRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetSlot();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetSlot();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetSlot();
    }
  }


}
