import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAndLossDetailComponent } from './profit-and-loss-detail.component';

describe('ProfitAndLossDetailComponent', () => {
  let component: ProfitAndLossDetailComponent;
  let fixture: ComponentFixture<ProfitAndLossDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitAndLossDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitAndLossDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
