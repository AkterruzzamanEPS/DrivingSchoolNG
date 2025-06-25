import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCollectionReportsComponent } from './payment-collection-reports.component';

describe('PaymentCollectionReportsComponent', () => {
  let component: PaymentCollectionReportsComponent;
  let fixture: ComponentFixture<PaymentCollectionReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCollectionReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCollectionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
