import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Shared/Service/auth.service';
import { CommonHelper } from '../../Shared/Service/common-helper.service';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { FormsModule } from '@angular/forms';
import { CalenderComponent } from "../calender/calender.component";
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AgGridAngular, CalenderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  private bookingGridApi!: any;
  public DeafultCol = AGGridHelper.DeafultCol;
  public rowData!: any[];
  private authService = inject(AuthService);
  private toast = inject(ToastrService);
  private http = inject(HttpHelperService);
  private datePipe = inject(DatePipe);
  private router = inject(Router);
  ngOnInit(): void {
    this.GetDayWiseBookings();
  }


  public colDefsTransection: any[] = [
    { valueGetter: "node.rowIndex + 1", headerName: 'SL', width: 90, editable: false, checkboxSelection: false },
    { field: 'UserName', width: 150, headerName: 'Student Name', filter: true },
    { field: 'StartTime', headerName: 'Start Time' },
    { field: 'EndTime', headerName: 'End Time' },
    { field: 'StatusName', headerName: 'Status' },
    // { field: '', headerName: 'Assign', width: 120, pinned: "right", resizable: true, cellRenderer: this.progressToGrid.bind(this) },
    // { field: '', headerName: 'Register', width: 120, pinned: "right", resizable: true, cellRenderer: this.detailToGrid.bind(this) },

  ];

  public currentUser = CommonHelper.GetUser();


  onGridReadyTransection(params: any) {
    this.bookingGridApi = params.api;
  }

  public CalenderEvent(event: any) {
    this.router.navigateByUrl('/admin/calender/' + event.dateTxt)
  }

  private GetDayWiseBookings() {
    this.http.Get(`Booking/GetDayWiseBookings?StartDate=${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}`).subscribe(
      (res: any) => {
        console.log(res);
        this.rowData = res;
        this.bookingGridApi.sizeColumnsToFit();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

}

