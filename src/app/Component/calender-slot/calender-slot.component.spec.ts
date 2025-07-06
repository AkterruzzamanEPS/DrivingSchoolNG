import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderSlotComponent } from './calender-slot.component';

describe('CalenderSlotComponent', () => {
  let component: CalenderSlotComponent;
  let fixture: ComponentFixture<CalenderSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderSlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
