import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayWiseBookingComponent } from './day-wise-booking.component';

describe('DayWiseBookingComponent', () => {
  let component: DayWiseBookingComponent;
  let fixture: ComponentFixture<DayWiseBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayWiseBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayWiseBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
