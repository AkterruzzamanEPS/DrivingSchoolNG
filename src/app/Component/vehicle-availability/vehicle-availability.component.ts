import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { VehicleAvailabilityRequestDto, VehicleAvailabilityFilterRequestDto } from '../../Model/VehicleAvailability';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-vehicle-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './vehicle-availability.component.html',
  styleUrl: './vehicle-availability.component.scss',
  providers: [DatePipe]
})
export class VehicleAvailabilityComponent implements OnInit, AfterViewInit {

  private vehicleavailabilityGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];

  public slotList: any[] = [];
  public vehicleList: any[] = [];

  public slotFromList: any[] = [];
  public vehicleFromList: any[] = [];

  public oVehicleAvailabilityRequestDto = new VehicleAvailabilityRequestDto();
  public oVehicleAvailabilityFilterRequestDto = new VehicleAvailabilityFilterRequestDto();

  public startDate: any = "";
  public endDate: any = "";
  public availableDate: any = "";

  public vehicleavailabilityId = 0;
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
    { field: 'vehicleName', width: 150, headerName: 'Vehicle Name', filter: true },
    { field: 'availableDate', width: 150, headerName: 'Available Date', filter: true },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
    { field: 'remarks', headerName: 'Remarks' },
    { field: 'isActive', headerName: 'Status' },
  ];
  trackByFn: TrackByFunction<any> | any;
  trackBySlot: TrackByFunction<any> | any;
  trackBySlotFrom: TrackByFunction<any> | any;

  trackByVehicle: TrackByFunction<any> | any;
  trackByVehicleFrom: TrackByFunction<any> | any;

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
    this.GetVehicleAvailability();
  }


  ngOnInit(): void {
    this.GetAllVehiclees();
    this.GetAllSlotes();

  }

  onGridReadyTransection(params: any) {
    this.vehicleavailabilityGridApi = params.api;
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
    this.GetVehicleAvailability();
  }

  private GetVehicleAvailability() {

    this.oVehicleAvailabilityFilterRequestDto.startDate = new Date(this.startDate);
    this.oVehicleAvailabilityFilterRequestDto.endDate = new Date(this.endDate);
    this.oVehicleAvailabilityFilterRequestDto.vehicleId = Number(this.oVehicleAvailabilityFilterRequestDto.vehicleId);
    this.oVehicleAvailabilityFilterRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleAvailabilityFilterRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`VehicleAvailability/GetVehicleAvailability?pageNumber=${this.pageIndex}`, this.oVehicleAvailabilityFilterRequestDto).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res.items;
        this.pageIndex = res.pageIndex;
        this.totalPages = res.totalPages;
        this.totalRecords = res.totalRecords;
        this.hasPreviousPage = res.hasPreviousPage;
        this.hasNextPage = res.hasNextPage;
        this.totalPageNumbers = CommonHelper.generateNumbers(this.pageIndex, this.totalPages)
        this.vehicleavailabilityGridApi.sizeColumnsToFit();
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
  private GetAllVehiclees() {
    this.http.Get(`Vehicle/GetAllVehicles`).subscribe(
      (res: any) => {
        this.vehicleList = res;
        this.vehicleFromList = res;
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public InsertVehicleAvailability() {
    this.oVehicleAvailabilityRequestDto.slotId = Number(this.oVehicleAvailabilityRequestDto.slotId);
    this.oVehicleAvailabilityRequestDto.vehicleId = Number(this.oVehicleAvailabilityRequestDto.vehicleId);
    this.oVehicleAvailabilityRequestDto.availableDate = new Date(this.oVehicleAvailabilityRequestDto.availableDate);
    this.oVehicleAvailabilityRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleAvailabilityRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`VehicleAvailability/InsertVehicleAvailability`, this.oVehicleAvailabilityRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetVehicleAvailability();
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateVehicleAvailability() {
    this.oVehicleAvailabilityRequestDto.slotId = Number(this.oVehicleAvailabilityRequestDto.slotId);
    this.oVehicleAvailabilityRequestDto.vehicleId = Number(this.oVehicleAvailabilityRequestDto.vehicleId);

    this.oVehicleAvailabilityRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleAvailabilityRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`VehicleAvailability/UpdateVehicleAvailability/${this.vehicleavailabilityId}`, this.oVehicleAvailabilityRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetVehicleAvailability();
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }


  public DeleteVehicleAvailability() {
    this.oVehicleAvailabilityRequestDto.isActive = CommonHelper.booleanConvert(this.oVehicleAvailabilityRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`VehicleAvailability/DeleteVehicleAvailability/${this.vehicleavailabilityId}`, this.oVehicleAvailabilityRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonDelete");
        this.GetVehicleAvailability();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }
  add() {
    CommonHelper.CommonButtonClick("openCommonModel");
    this.oVehicleAvailabilityRequestDto = new VehicleAvailabilityRequestDto();
    this.vehicleavailabilityId = 0;
  }

  edit() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.vehicleavailabilityGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.vehicleavailabilityId = Number(getSelectedItem.id);
    this.oVehicleAvailabilityRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oVehicleAvailabilityRequestDto.vehicleId = Number(getSelectedItem.vehicleId);
    this.oVehicleAvailabilityRequestDto.availableDate = new Date(getSelectedItem.availableDate);
    this.oVehicleAvailabilityRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oVehicleAvailabilityRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonModel");
  }

  delete() {
    let getSelectedItem = AGGridHelper.GetSelectedRow(this.vehicleavailabilityGridApi);
    if (getSelectedItem == null) {
      this.toast.warning("Please select an item", "Warning!!", { progressBar: true })
    }
    this.vehicleavailabilityId = Number(getSelectedItem.id);
    this.oVehicleAvailabilityRequestDto.slotId = Number(getSelectedItem.slotId);
    this.oVehicleAvailabilityRequestDto.vehicleId = Number(getSelectedItem.vehicleId);
    this.oVehicleAvailabilityRequestDto.availableDate = new Date(getSelectedItem.availableDate);
    this.oVehicleAvailabilityRequestDto.isActive = CommonHelper.booleanConvert(getSelectedItem.isActive);
    this.oVehicleAvailabilityRequestDto.remarks = getSelectedItem.remarks;
    CommonHelper.CommonButtonClick("openCommonDelete");

  }


  public onPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.pageIndex--;
      this.GetVehicleAvailability();
    }
  }

  public onPage(pageNumber: number): void {
    if (this.hasNextPage) {
      this.pageIndex = pageNumber;
      this.GetVehicleAvailability();
    }
  }

  public onNextPage(): void {
    if (this.hasNextPage) {
      this.pageIndex++;
      this.GetVehicleAvailability();
    }
  }


}

