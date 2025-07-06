import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Holiday, OffDayFormDto, OffDayProjectDto, OffDayDetailsDto } from '../../Model/Holiday';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';

@Component({
  selector: 'app-calender-slot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calender-slot.component.html',
  styleUrl: './calender-slot.component.scss',
    providers: [DatePipe]
})
export class CalenderSlotComponent implements OnInit {

  calenderEvent = output<Holiday>();
  oHoliday = new Holiday();
  oHolidays: Holiday[] = [];
  public offDayFormDto: OffDayFormDto = new OffDayFormDto();
  public offDayDTO: OffDayProjectDto = new OffDayProjectDto();
  public modulename = "org"
  selectedDates: Holiday[] = [];
  da = new Date();

  oOrgOffDayDetailsDto = new OffDayDetailsDto();
  constructor(private http: HttpHelperService, private toast: ToastrService, private router: Router) { }

  year = 2023;
  month = 3;
  days: any[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  offDayList = [];
  offDaySubmitList: any[] = [];

  currentDate: any;

  ngOnInit() {
    this.GetMonthlySlotAvailability();
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.GetOrgOffDayDetails();// get data for dat
    this.currentDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

    console.log(this.oHolidays)
  }

  private GetMonthlySlotAvailability() {
    const startDate = `${this.year}-${('0' + this.month).slice(-2)}-01`;
    // After the hash is generated, proceed with the API call
    this.http.Get(`Booking/GetMonthlySlotAvailability?StartDate=${startDate}`).subscribe(
      (res: any) => {
        console.log(res);
        res.forEach((item: any) => {

        });

      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  GetOrgOffDayDetails() {

    try {
      this.offDayDTO.offDayYearId = this.year;
      this.offDayDTO.offDayMonthId = this.month;
      this.offDayDTO.offDayProjectId = 0;
      this.offDayDTO.offDayDepartmentId = 0;
      this.offDayDTO.offDayRelatedModule = this.modulename;
    } catch (e) {

    }
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
    debugger
    console.log("day", day)
    // this.router.navigateByUrl('/calender/' + day.dateTxt)
    this.calenderEvent.emit(day);
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
    this.GetMonthlySlotAvailability();
  }

  incrementYear(increment: any) {
    this.year = increment > 0 ? this.year + 1 : this.year - 1;
    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.GetOrgOffDayDetails();
    this.GetMonthlySlotAvailability();
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
