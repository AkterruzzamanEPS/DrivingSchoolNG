import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAssignmentComponent } from './slot-assignment.component';

describe('SlotAssignmentComponent', () => {
  let component: SlotAssignmentComponent;
  let fixture: ComponentFixture<SlotAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
