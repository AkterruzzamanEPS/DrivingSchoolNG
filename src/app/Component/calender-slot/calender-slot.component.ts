import { CommonModule, DatePipe, DatePipeConfig } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Holiday, OffDayFormDto, OffDayProjectDto, OffDayDetailsDto } from '../../Model/Holiday';
import { HttpHelperService } from '../../Shared/Service/http-helper.service';
import { SlotRequestDto } from '../../Model/Slot';
import { CommonHelper } from '../../Shared/Service/common-helper.service';

@Component({
  selector: 'app-calender-slot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calender-slot.component.html',
  styleUrl: './calender-slot.component.scss',
  providers: [DatePipe]
})
export class CalenderSlotComponent implements OnInit, AfterViewInit {

  calenderEvent = output<Holiday>();
  oHoliday = new Holiday();
  oHolidays: Holiday[] = [];
  public offDayFormDto: OffDayFormDto = new OffDayFormDto();
  public offDayDTO: OffDayProjectDto = new OffDayProjectDto();
  public modulename = "org"
  selectedDates: Holiday[] = [];
  da = new Date();

  oOrgOffDayDetailsDto = new OffDayDetailsDto();
  constructor(private http: HttpHelperService, private toast: ToastrService, private datePipe: DatePipe, private router: Router) { }
  ngAfterViewInit(): void {
    // Example: Call click manually after 1 second (simulate)
    setTimeout(() => {
      this.triggerSlotClickManually(0); // Triggers the first slot button
    }, 1000);
  }

  year = 2023;
  month = 3;
  days: any[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  offDayList = [];
  offDaySubmitList: any[] = [];

  currentDate: any;

  selectedDate: any;
  // Get all manageBtn refs
  @ViewChildren('manageBtn') manageButtons!: QueryList<ElementRef>;

  public oSlotRequestDto = new SlotRequestDto();
  public SlotId = 0;
  public startTime = "";
  public endTime = "";

  public allSlots: any[] = [];

  ngOnInit() {
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.days = this.generateDays(this.year, this.month);
    this.GetMonthlySlot();


    console.log(this.oHolidays)
  }

  triggerSlotClickManually(index: number) {
    const btn = this.manageButtons.toArray()[index];
    if (btn) {
      // btn.nativeElement.click(); // This will trigger daymathod() as if user clicked it
    }
  }

  private GetMonthlySlot() {
    const startDate = `${this.year}-${('0' + this.month).slice(-2)}-01`;
    // After the hash is generated, proceed with the API call
    this.http.Get(`Slot/GetMonthlySlot?StartDate=${startDate}`).subscribe(
      (res: any) => {
        this.allSlots = res;
        const d = new Date();
        this.dataSet();
        this.GetOrgOffDayDetails();// get data for dat
        this.currentDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
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
        let find = this.allSlots.filter(x => this.datePipe.transform(x.SlotDate, 'yyyy-MM-dd') == this.datePipe.transform(day.dateTxt, 'yyyy-MM-dd'));
        day.Slots = find;
        this.oHolidays.push(day);
      });
    });
    this.selectedDates = [];
  }

  daymathod(day: any, slot?: any) {

    console.log("slot", slot)
    console.log("day", day)
    if (slot == undefined) {
      this.selectedDate = day.dateTxt;
      CommonHelper.CommonButtonClick("openCommonModel");
    } else {

      this.SlotId = Number(slot.SlotId);
      this.oSlotRequestDto.name = "";
      this.oSlotRequestDto.date = new Date(slot.SlotDate);
      this.startTime = slot.StartTime;
      this.endTime = slot.EndTime;
      this.oSlotRequestDto.isActive = true;
      this.oSlotRequestDto.remarks = '';
      this.selectedDate = day.dateTxt;
      CommonHelper.CommonButtonClick("openCommonModel");
    }

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
    this.GetMonthlySlot();
  }

  incrementYear(increment: any) {
    this.year = increment > 0 ? this.year + 1 : this.year - 1;
    this.days = this.generateDays(this.year, this.month);
    this.dataSet();
    this.GetOrgOffDayDetails();
    this.GetMonthlySlot();
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


  public InsertSlot() {
    this.oSlotRequestDto.startTime = CommonHelper.formatTime(this.startTime);
    this.oSlotRequestDto.endTime = CommonHelper.formatTime(this.endTime);
    this.oSlotRequestDto.date = new Date(this.selectedDate);
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);

    if (this.oSlotRequestDto.startTime == "" || this.oSlotRequestDto.startTime == '00:00:00') {
      this.toast.warning("Please enter start time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oSlotRequestDto.endTime == "" || this.oSlotRequestDto.endTime == '00:00:00') {
      this.toast.warning("Please enter end time", "Warning!!", { progressBar: true });
      return;
    }


    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/InsertSlot`, this.oSlotRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Save Successfully!!", "Success!!", { progressBar: true });
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMonthlySlot();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

  public UpdateSlot() {
    this.oSlotRequestDto.startTime = CommonHelper.formatTime(this.startTime);
    this.oSlotRequestDto.endTime = CommonHelper.formatTime(this.endTime);
    this.oSlotRequestDto.date = new Date(this.selectedDate);
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);

    if (this.oSlotRequestDto.startTime == "" || this.oSlotRequestDto.startTime == '00:00:00') {
      this.toast.warning("Please enter start time", "Warning!!", { progressBar: true });
      return;
    }
    if (this.oSlotRequestDto.endTime == "" || this.oSlotRequestDto.endTime == '00:00:00') {
      this.toast.warning("Please enter end time", "Warning!!", { progressBar: true });
      return;
    }


    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/UpdateSlot/${this.SlotId}`, this.oSlotRequestDto).subscribe(
      (res: any) => {
        this.toast.success("Data Update Successfully!!", "Success!!", { progressBar: true });
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMonthlySlot();
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );
  }


  public DeleteSlot() {
    this.oSlotRequestDto.startTime = CommonHelper.formatTime(this.startTime);
    this.oSlotRequestDto.endTime = CommonHelper.formatTime(this.endTime);
    this.oSlotRequestDto.date = new Date(this.selectedDate);
    this.oSlotRequestDto.isActive = CommonHelper.booleanConvert(this.oSlotRequestDto.isActive);
    // After the hash is generated, proceed with the API call
    this.http.Post(`Slot/DeleteSlot/${this.SlotId}`, this.oSlotRequestDto).subscribe(
      (res: any) => {
        CommonHelper.CommonButtonClick("closeCommonModel");
        this.GetMonthlySlot();
        this.toast.success("Data Delete Successfully!!", "Success!!", { progressBar: true });
      },
      (err) => {
        this.toast.error(err.ErrorMessage, "Error!!", { progressBar: true });
      }
    );

  }

}
