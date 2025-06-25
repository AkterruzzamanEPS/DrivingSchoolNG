import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostRequestDto, PostFilterRequestDto } from '../../Model/Post';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  providers: [DatePipe]
})
export class ContentComponent implements OnInit, AfterViewInit {

  private postGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public categoryList: any[] = [];
  public parentList: any[] = [];
  public statusList: any[] = [];

  public categoryFromList: any[] = [];
  public parentFromList: any[] = [];

  public oPostRequestDto = new PostRequestDto();
  public oPostFilterRequestDto = new PostFilterRequestDto();

  public requestedAt: string = "";
  public startDate: any;
  public endDate: any;
  private selectedFile: any;
  public postId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'categoryName', width: 150, headerName: 'Category', filter: true },
    { field: 'subCategoryName', width: 150, headerName: 'Sub Category', filter: true },
    { field: 'name', width: 150, headerName: 'Title', filter: true },
    { field: 'shortName', width: 150, headerName: 'Short Name', filter: true },
    { field: 'content', width: 150, headerName: 'Content', filter: true },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
  ];

  trackByFn: TrackByFunction<any> | any;
  trackByCategory: TrackByFunction<any> | any;
  trackByCategoryFrom: TrackByFunction<any> | any;

  trackByParent: TrackByFunction<any> | any;
  trackByParentFrom: TrackByFunction<any> | any;

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


  }

  ngAfterViewInit(): void {
    this.GetPost();
  }


  ngOnInit(): void {
    this.GetAllParentes();
    this.GetAllCategoryes();

  }

  onGridReadyTransection(params: any) {
    this.postGridApi = params.api;
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
    this.GetPost();
  }

  private GetPost() {

    this.oPostFilterRequestDto.startDate = new Date(this.startDate);
    this.oPostFilterRequestDto.endDate = new Date(this.endDate);
    this.oPostFilterRequestDto.categoryId = Number(this.oPostFilterRequestDto.categoryId);
    this.oPostFilterRequestDto.parentId = Number(this.oPostFilterRequestDto.parentId);
    this.oPostFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oPostFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Post/GetPost?pageNumber=${this.pageIndex}`, this.oPostFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.postGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public CategoryChange(event: any) {
    this.GetAllParentes();
  }

  public CategoryFromChange(event: any) {
    this.GetAllFromParentes();
  }

  private GetAllCategoryes() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`Category/GetAllCategories/` + 0).subscribe(
      (res: any) => {
        this.categoryList = res;
        this.categoryFromList = res;
        this.parentList = [];
        this.parentFromList = [];
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAllParentes() {
    this.http.Get(`Category/GetAllCategories/` + Number(this.oPostFilterRequestDto.categoryId)).subscribe(
      (res: any) => {
        this.parentList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  private GetAllFromParentes() {
    this.http.Get(`Category/GetAllCategories/` + Number(this.oPostRequestDto.categoryId)).subscribe(
      (res: any) => {
        this.parentFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public onImageFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (this.selectedFile == undefined) {
        this.toast.warning("Please select you file", "Warning!!", { progressBar: true });
        return;
      }
      this.http.UploadFile(`UploadedFile/Upload`, this.selectedFile).subscribe(
        (res: any) => {
          this.oPostRequestDto.fileId = res.id;
        },
        (err) => {
          this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
        }
      );
    }

  }

  public InsertPost() {

    if (this.oPostRequestDto.categoryId < 0) {
      this.toast.warning("Please select category", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oPostRequestDto.parentId < 0) {
      this.toast.warning("Please select sub category", "Warning!!", { progressBar: true });
      return;
    }
    let currentUser = CommonHelper.GetUser();
    this.oPostRequestDto.categoryId = Number(this.oPostRequestDto.categoryId);
    this.oPostRequestDto.parentId = Number(this.oPostRequestDto.parentId);
    this.oPostRequestDto.fileId = Number(this.oPostRequestDto.fileId);
    this.oPostRequestDto.isActive = CommonHelper.booleanConvert(this.oPostRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Post/InsertPost`, this.oPostRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetPost();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdatePost() {

    if (this.oPostRequestDto.categoryId < 0) {
      this.toast.warning("Please select category", "Warning!!", { progressBar: true });
      return;
    }

    if (this.oPostRequestDto.parentId < 0) {
      this.toast.warning("Please select sub category", "Warning!!", { progressBar: true });
      return;
    }

    this.oPostRequestDto.categoryId = Number(this.oPostRequestDto.categoryId);
    this.oPostRequestDto.parentId = Number(this.oPostRequestDto.parentId);
    this.oPostRequestDto.fileId = Number(this.oPostRequestDto.fileId);
    this.oPostRequestDto.isActive = CommonHelper.booleanConvert(this.oPostRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Post/UpdatePost/${this.postId}`, this.oPostRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetPost();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  public DeletePost() {
    this.oPostRequestDto.isActive = CommonHelper.booleanConvert(this.oPostRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Post/DeletePost/${this.postId}`, this.oPostRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetPost();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oPostRequestDto = new PostRequestDto();
    this.postId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.postGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.postId = Number(getSelectedItem.id);
    this.oPostRequestDto.categoryId = Number(getSelectedItem.categoryId);
    this.oPostRequestDto.parentId = Number(getSelectedItem.parentId);
    this.oPostRequestDto.shortName = getSelectedItem.shortName;
    this.oPostRequestDto.name = getSelectedItem.name;
    this.oPostRequestDto.content = getSelectedItem.content;
    this.oPostRequestDto.fileId = Number(getSelectedItem.fileId);
    this.oPostRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oPostRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.postGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.postId = Number(getSelectedItem.id);
    this.oPostRequestDto.categoryId = Number(getSelectedItem.categoryId);
    this.oPostRequestDto.parentId = Number(getSelectedItem.parentId);
    this.oPostRequestDto.shortName = getSelectedItem.shortName;
    this.oPostRequestDto.name = getSelectedItem.name;
    this.oPostRequestDto.content = getSelectedItem.content;
    this.oPostRequestDto.fileId = Number(getSelectedItem.fileId);
    this.oPostRequestDto.isActive = getSelectedItem.isActive;
    this.oPostRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetPost();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetPost();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetPost();
    }
  }


}


