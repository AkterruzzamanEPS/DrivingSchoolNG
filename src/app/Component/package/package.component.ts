import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PackageFilterRequestDto, PackageRequestDto } from '../../Model/Package';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss',
  providers: [DatePipe]
})
export class PackageComponent implements OnInit {

  private packageGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oPackageFilterRequestDto = new PackageFilterRequestDto();
  public oPackageRequestDto = new PackageRequestDto();

  public packageId = 0;
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
    { field: 'price', width: 150, headerName: 'Fees', filter: true },
    { field: 'totalLessons', width: 150, headerName: 'Total Lessons', filter: true },
    { field: 'rate', width: 150, headerName: 'Rate', filter: true },
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
    this.GetPackage();
  }

  onGridReadyTransection(params: any) {
    this.packageGridApi = params.api;
    this.rowData = [];
  }


  editToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-success p-0 px-1"> <i class="bi bi-pencil-square"></i> Edit</button>'
    eDiv.addEventListener('click', () => {
      this.router.navigateByUrl('admin/package/' + params.data.id)
    });
    return eDiv;
  }

  deleteToGrid(params: any) {
    const eDiv = document.createElement('div');
    eDiv.innerHTML = ' <button class="btn btn-danger p-0 px-1"> <i class="bi bi-trash"></i> Delete</button>'
    eDiv.addEventListener('click', () => {
      this.packageId = Number(params.data.id);
      this.cdr.detectChanges(); // 👈 Force change detection
      CommonHelper.CommonButtonClick("openCommonDelete");
    });
    return eDiv;
  }


  Filter() {
    this.GetPackage();
  }

  private GetPackage() {
    this.oPackageFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oPackageFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Package/GetPackage?pageNumber=${this.pageIndex}`, this.oPackageFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.packageGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public DeletePackage() {
    this.oPackageRequestDto.isActive = CommonHelper.booleanConvert(this.oPackageRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Package/DeletePackage/${this.packageId}`, this.oPackageRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetPackage();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    this.router.navigateByUrl('admin/package/0')
  }


  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.packageGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.packageId = Number(getSelectedItem.id);
    this.oPackageRequestDto.name = getSelectedItem.name;
    this.oPackageRequestDto.description = getSelectedItem.description;
    this.oPackageRequestDto.totalLessons = Number(getSelectedItem.totalLessons);
    this.oPackageRequestDto.rate = Number(getSelectedItem.rate);
    this.oPackageRequestDto.fileId = Number(getSelectedItem.fileId);
    this.oPackageRequestDto.price = Number(getSelectedItem.price);
    this.oPackageRequestDto.isActive = getSelectedItem.isActive;
    this.oPackageRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetPackage();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetPackage();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetPackage();
    }
  }


}
