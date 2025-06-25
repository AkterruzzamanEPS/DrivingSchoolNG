import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAvailabilityComponent } from './vehicle-availability.component';

describe('VehicleAvailabilityComponent', () => {
  let component: VehicleAvailabilityComponent;
  let fixture: ComponentFixture<VehicleAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
