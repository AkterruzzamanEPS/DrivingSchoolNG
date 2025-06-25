import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalTestResultComponent } from './final-test-result.component';

describe('FinalTestResultComponent', () => {
  let component: FinalTestResultComponent;
  let fixture: ComponentFixture<FinalTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalTestResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
