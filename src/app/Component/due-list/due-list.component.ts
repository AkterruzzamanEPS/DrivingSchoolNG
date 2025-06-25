import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { UserPackageFilterRequestDto } from '../../Model/UserPackage';
import { AuthService } from '../../Shared/Service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonHelper } from '../../Shared/Service/common-helper.service';

@Component({
  selector: 'app-due-list',
  standalone: true,
  imports:  [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './due-list.component.html',
  styleUrl: './due-list.component.scss'
})
export class DueListComponent implements OnInit, AfterViewInit {

  private userpackageGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public oUserPackageFilterRequestDto = new UserPackageFilterRequestDto();
  public username: string = "";
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'userName', width: 150, headerName: 'User', filter: true },
    { field: 'packageName', width: 150, headerName: 'Package Name', filter: true },
    // { field: 'totalLessons', width: 150, headerName: 'Total Lessons', filter: true },
    // { field: 'durationInDays', width: 150, headerName: 'Duration In Days', filter: true },
    { field: 'price', width: 150, headerName: 'Amount', filter: true },
    { field: 'paymentAmount', width: 150, headerName: 'Paid Amount', filter: true },
    { field: 'remaingAmount', width: 150, headerName: 'Due Amount', filter: true },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByPackage: TrackByFunction<any> | any;
  trackByPackageFrom: TrackByFunction<any> | any;
  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router) {
  }

  ngAfterViewInit(): void {
    // this.GetUserPackage();
  }


  ngOnInit(): void {
    this.GetUserPackage();
  }


  onGridReadyTransection(params: any) {
    this.userpackageGridApi = params.api;
    this.rowData = [];
  }


  Filter() {
    this.GetUserPackage();
  }

  private GetUserPackage() {
    this.oUserPackageFilterRequestDto.name = this.username;
    // After the hash is generated, proceed with the API call
    this.http.Post(`UserPackage/GetUserPackageDueList?pageNumber=${this.pageIndex}`, this.oUserPackageFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.userpackageGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetUserPackage();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetUserPackage();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetUserPackage();
    }
  }


}

