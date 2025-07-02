import { inject, Injectable } from '@angular/core';
import { UserResponseDto } from '../../Model/UserResponseDto';
import { HttpHelperService } from './http-helper.service';


@Injectable()

export class CommonHelper {

  private http = inject(HttpHelperService);
  static http: any;
  constructor() { }

  public static CommonButtonClick(elementId: string) {
    document.getElementById(elementId)?.click();
  }

  public static resetFileInput(elementId: string) {
    const fileInput = document.getElementById(elementId) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input
    } else {
      console.error(`Element with ID "${elementId}" not found.`);
    }
  }

  public static GetImageUrl(fileId: number): string {
    return `${this.http.appUrl}UploadedFile/GetImage/${fileId}`;
  }
  public static IsValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  public static RateCalCulate(price: number, Lesson: number): number {
    return Math.round(price / Lesson);
  }

  // Pagination Number generated 
  public static generateNumbers(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  public static isValidNumber(input: string): boolean {
    const regex = /^\d{11}$/; // Matches exactly 11 digits
    return regex.test(input);
  }
  public static booleanConvert(booleanValue: any): boolean {
    if (booleanValue == "true") {
      return true
    }
    else if (booleanValue == "false") {
      return false
    } else if (booleanValue == true) {
      return true
    }
    else if (booleanValue == false) {
      return false
    } else {
      return true;
    }
  }

  public static GetUser(): UserResponseDto | null {
    let oUserResponseDto = new UserResponseDto();
    if (typeof window !== 'undefined' && localStorage) {
      var user = localStorage.getItem("UserResponseDto");
      if (user != null) {
        oUserResponseDto = JSON.parse(user);
      }
    }
    return oUserResponseDto;
  }


  public static getLessonSlots(startDate: Date, selectedDays: string[], totalLessons: number, slot: any): any[] {
    const result: any[] = [];
    debugger
    let date = startDate;

    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };

    const targetDayNumbers = selectedDays
      .map(day => day.toLowerCase().trim())
      .map(day => dayMap[day]);

    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

    while (result.length < totalLessons) {
      if (targetDayNumbers.includes(date.getDay())) {
        result.push({
          date: date.toISOString().split('T')[0],
          day: formatter.format(date),
          slotName: slot.name,
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      }
      date.setDate(date.getDate() + 1);
    }

    return result;
  }


}
