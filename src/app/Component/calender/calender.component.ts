import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Holiday, OffDayDetailsDto, OffDayFormDto, OffDayProjectDto } from '../../Model/Holiday';
import { AGGridHelper } from '../../Shared/Service/AGGridHelper';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss',
  providers: [DatePipe]
})
export class CalenderComponent implements OnInit {

  oHoliday = new Holiday();
  oHolidays: Holiday[] = [];
  public offDayFormDto: OffDayFormDto = new OffDayFormDto();
  public offDayDTO: OffDayProjectDto = new OffDayProjectDto();
  public modulename = "org"
  selectedDates: Holiday[] = [];
  da = new Date();
  rowData = [];
  rowClass: any;
  private gridApi!: GridApi;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  public defaultColDef = AGGridHelper.DeafultCol;
  // oOrgOffDayDetailsDto = new OrgOffDayDetailsDto();
  oOrgOffDayDetailsDto = new OffDayDetailsDto();
  constructor(private service: HttpHelperService, private toast: ToastrService, private router: Router) { }

  year = 2023;
  month = 3;
  days: any[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  nTotalDay = 0;
  nOffDay = 0;
  nWorkingDay = 0;
  // weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  offDayList = [];
  offDaySubmitList: any[] = [];


  columnDefs1: ColDef[] = [
    { field: 'monthName', headerName: 'Month Name', sortable: true, filter: true, cellStyle: { 'border-right': '0.5px solid silver' } },
    { field: 'countOrgOffDay', headerName: 'No Of Off Day', sortable: true, filter: true },
  ];

  ngOnInit() {
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.nOffDay = this.selectedDates.length;
    this.nTotalDay = new Date(this.year, this.month, 0).getDate();
    this.nWorkingDay = this.nTotalDay - this.nOffDay;
    this.GetOrgOffDayDetails();// get data for dat
  }


  GetOrgOffDayDetails() {

    try {
      this.offDayDTO.offDayYearId = this.year;
      this.offDayDTO.offDayMonthId = this.month;
      this.offDayDTO.offDayProjectId = 0;
      this.offDayDTO.offDayDepartmentId = 0;
      this.offDayDTO.offDayRelatedModule = this.modulename;

      this.service.Get("this.offDayFormDto").subscribe(res => {

        this.oOrgOffDayDetailsDto = res as unknown as OffDayDetailsDto;
        // this.gridApi.setRowData(this.oOrgOffDayDetailsDto.monthlyOffDayCountList)

      }, (err) => {
        this.oOrgOffDayDetailsDto = new OffDayDetailsDto();
      });
    } catch (e) {

    }
  }


  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  dataSet() {
    this.oHolidays = [];
    this.days.forEach(element => {
      element.forEach((day: any) => {
        this.oHolidays.push(day);
      });
    });
    this.selectedDates = [];
  }

  dayselectedMathod() {
    this.oOrgOffDayDetailsDto.offDayDatetimeList.forEach(element => {
      this.da = new Date(element);
      let holid = new Holiday();
      holid.dateTxt = this.da.getFullYear() + '-' + ('0' + (this.da.getMonth() + 1)).slice(-2) + '-' + ('0' + this.da.getDate()).slice(-2);
      holid.day = this.da.getDate();
      holid.isMonth = this.da.getMonth() == this.month - 1;
      this.daymathod(holid);
    })
  }

  daymathod(day: any) {
    this.oHoliday = new Holiday();
    this.oHoliday = day;
    const found = this.selectedDates.find(element => element.dateTxt == this.oHoliday.dateTxt);
    if (found == undefined && this.oHoliday.isMonth == true) {
      this.selectedDates.push(this.oHoliday);
    }
    this.selectedDates.forEach(element => {

      if (found != undefined) {
        if (found.dateTxt === element.dateTxt) {
          // document.getElementById(element.dateTxt).style.backgroundColor = 'white';
          // document.getElementById(element.dateTxt).style.color = 'black';
          // this.selectedDates = this.selectedDates.filter(x => x.dateTxt != found.dateTxt);
        } else {
          // document.getElementById(element.dateTxt).style.backgroundColor = 'red';
          // document.getElementById(element.dateTxt).style.color = 'white';
        }
      } else {
        // document.getElementById(element.dateTxt).style.backgroundColor = 'red';
        // document.getElementById(element.dateTxt).style.color = 'white';
      }
    });
  }
  closeModal() {
    document.getElementById("modalclose")?.click()
  }
  submitDate() {
    this.closeModal()
  }


  incrementMonth(increment: number) {
    this.month += increment;

    if (this.month > 12) {
      this.month = 1;
      this.year++;
    } else if (this.month < 1) {
      this.month = 12;
      this.year--;
    }

    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.GetOrgOffDayDetails();
  }

  incrementYear(increment: any) {
    this.year = increment > 0 ? this.year + 1 : this.year - 1;
    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.GetOrgOffDayDetails();
  }
  private generateDays(year: number, month: number) {
    const increment = this.getIncrement(year, month);
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const startDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
    const totalCells = startDay + totalDaysInMonth;

    // Calculate how many weeks (rows) are needed
    const totalWeeks = Math.min(5, Math.ceil(totalCells / 7)); // max 5 rows

    const days: any[] = [];

    for (let week = 0; week < totalWeeks; week++) {
      days.push([]);
      for (let day = 0; day < 7; day++) {
        days[week].push(this.getDate(week, day, year, month, increment));
      }
    }

    return days;
  }

  // private getIncrement(year: number, month: number): number {
  //   let date = new Date("" + year + "-" + month + "-1");
  //   let increment = date.getDay() > 0 ? date.getDay() - 2 : 5;
  //   return increment;
  // }

  private getIncrement(year: number, month: number): number {
    const firstDay = new Date(year, month - 1, 1).getDay();
    return (firstDay + 6) % 7; // Converts Sun=0 to 6, Mon=1 to 0, etc.
  }

  private getDate(week: number, dayWeek: number, year: number, month: number, increment: number) {
    let date: any;
    let day = week * 7 + dayWeek - increment;
    if (day <= 0) {
      let fechaAuxiliar = new Date("" + year + "-" + month + "-1");
      date = new Date(
        fechaAuxiliar.getTime() + (day - 1) * 24 * 60 * 60 * 1000
      );
    } else {
      date = new Date("" + year + "-" + month + "-" + day);
      if (isNaN(date.getTime())) {
        let fechaAuxiliar = new Date("" + year + "-" + month + "-1");
        date = new Date(
          fechaAuxiliar.getTime() + (day + 1 - increment) * 24 * 60 * 60 * 1000
        );
      }
    }
    return {
      dateTxt: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
      date: date,
      day: date.getDate(),
      isMonth: date.getMonth() == month - 1,
      description: ""
    };
  }

}
