import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureHeadComponent } from './expenditure-head.component';

describe('ExpenditureHeadComponent', () => {
  let component: ExpenditureHeadComponent;
  let fixture: ComponentFixture<ExpenditureHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenditureHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenditureHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
