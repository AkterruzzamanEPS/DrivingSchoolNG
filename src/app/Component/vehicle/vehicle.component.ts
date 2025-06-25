import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { VehicleRequestDto, VehicleFilterRequestDto } from '../../Model/Vehicle';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [DatePipe]
})
export class VehicleComponent implements OnInit, AfterViewInit {

  private vehicleGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  public userList: any[] = [];

  public oVehicleRequestDto = new VehicleRequestDto();
  public oVehicleFilterRequestDto = new VehicleFilterRequestDto();

  public lastServicedAt: any = "";
  public insuranceExpiryDate: any = "";

  public vehicleId = 0;
  // pagination setup
  public pageIndex: number = 1;
  public totalRecords: number = 0;
  public totalPages: number = 0;
  public hasPreviousPage: boolean = false;
  public hasNextPage: boolean = false;
  public totalPageNumbers: number[] = [];

  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'make', width: 150, headerName: 'make', filter: true },
    { field: 'model', width: 150, headerName: 'model', filter: true },
    { field: 'registrationNumber', width: 150, headerName: 'registrationNumber', filter: true },
    { field: 'color', width: 150, headerName: 'color', filter: true },
    { field: 'fuelTypeName', width: 150, headerName: 'fuelType', filter: true },
    { field: 'transmissionTypeName', headerName: 'transmissionType' },
    { field: 'userName', headerName: 'Instructor' },
    { field: 'statusName', headerName: 'Status' },
    { field: 'lastServicedAt', headerName: 'last Serviced At' },
    { field: 'insuranceExpiryDate', headerName: 'insurance Expiry Date' },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackByUser: TrackByFunction<any> | any;
  trackByUserFrom: TrackByFunction<any> | any;

  trackByStatus: TrackByFunction<any> | any;
  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private http: HttpHelperService,
    private router: Router,
    private datePipe: DatePipe) {
    this.lastServicedAt = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.insuranceExpiryDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {
    this.GetVehicle();
  }


  ngOnInit(): void {
    this.GetAspNetUsersByType();
  }

  onGridReadyTransection(params: any) {
    this.vehicleGridApi = params.api;
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

  private GetAspNetUsersByType() {
    // After the hash is generated, proceed with the API call
    this.http.Get(`AspNetUsers/GetAspNetUsersByType?Type=3`).subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  Filter() {
    this.GetVehicle();
  }

  private GetVehicle() {

    this.oVehicleFilterRequestDto.fuelType = Number(this.oVehicleFilterRequestDto.fuelType);
    this.oVehicleFilterRequestDto.transmissionType = Number(this.oVehicleFilterRequestDto.transmissionType);
    this.oVehicleFilterRequestDto.status = Number(this.oVehicleFilterRequestDto.status);
    this.oVehicleFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Vehicle/GetVehicle?pageNumber=${this.pageIndex}`, this.oVehicleFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertVehicle() {
    this.oVehicleRequestDto.year = Number(this.oVehicleRequestDto.year);
    this.oVehicleRequestDto.fuelType = Number(this.oVehicleRequestDto.fuelType);
    this.oVehicleRequestDto.transmissionType = Number(this.oVehicleRequestDto.transmissionType);
    this.oVehicleRequestDto.lastServicedAt = new Date(this.lastServicedAt);
    this.oVehicleRequestDto.insuranceExpiryDate = new Date(this.insuranceExpiryDate);
    this.oVehicleRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Vehicle/InsertVehicle`, this.oVehicleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetVehicle();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateVehicle() {
    this.oVehicleRequestDto.year = Number(this.oVehicleRequestDto.year);
    this.oVehicleRequestDto.fuelType = Number(this.oVehicleRequestDto.fuelType);
    this.oVehicleRequestDto.transmissionType = Number(this.oVehicleRequestDto.transmissionType);
    this.oVehicleRequestDto.lastServicedAt = new Date(this.lastServicedAt);
    this.oVehicleRequestDto.insuranceExpiryDate = new Date(this.insuranceExpiryDate);
    this.oVehicleRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleRequestDto.isActive);

    this.http.Post(`Vehicle/UpdateVehicle/${this.vehicleId}`, this.oVehicleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetVehicle();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteVehicle() {
    this.oVehicleRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Vehicle/DeleteVehicle/${this.vehicleId}`, this.oVehicleRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetVehicle();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oVehicleRequestDto = new VehicleRequestDto();
    this.vehicleId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.vehicleGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.vehicleId = Number(getSelectedItem.id);
    this.oVehicleRequestDto.make = getSelectedItem.make;
    this.oVehicleRequestDto.model = getSelectedItem.model;
    this.oVehicleRequestDto.registrationNumber = getSelectedItem.registrationNumber;
    this.oVehicleRequestDto.color = getSelectedItem.color;
    this.oVehicleRequestDto.year = Number(getSelectedItem.year);
    this.oVehicleRequestDto.fuelType = Number(getSelectedItem.fuelType);
    this.oVehicleRequestDto.transmissionType = Number(getSelectedItem.transmissionType);
    this.oVehicleRequestDto.status = Number(getSelectedItem.status);
    this.oVehicleRequestDto.lastServicedAt = new Date(getSelectedItem.lastServicedAt);
    this.oVehicleRequestDto.insuranceExpiryDate = new Date(getSelectedItem.insuranceExpiryDate);
    this.oVehicleRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oVehicleRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.vehicleGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.vehicleId = Number(getSelectedItem.id);
    this.oVehicleRequestDto.make = getSelectedItem.make;
    this.oVehicleRequestDto.model = getSelectedItem.model;
    this.oVehicleRequestDto.registrationNumber = getSelectedItem.registrationNumber;
    this.oVehicleRequestDto.color = getSelectedItem.color;
    this.oVehicleRequestDto.year = Number(getSelectedItem.year);
    this.oVehicleRequestDto.fuelType = Number(getSelectedItem.fuelType);
    this.oVehicleRequestDto.transmissionType = Number(getSelectedItem.transmissionType);
    this.oVehicleRequestDto.status = Number(getSelectedItem.status);
    this.oVehicleRequestDto.lastServicedAt = new Date(getSelectedItem.lastServicedAt);
    this.oVehicleRequestDto.insuranceExpiryDate = new Date(getSelectedItem.insuranceExpiryDate);
    this.oVehicleRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oVehicleRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetVehicle();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetVehicle();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetVehicle();
    }
  }


}


