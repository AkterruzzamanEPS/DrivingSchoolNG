import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureHeadCreateComponent } from './expenditure-head-create.component';

describe('ExpenditureHeadCreateComponent', () => {
  let component: ExpenditureHeadCreateComponent;
  let fixture: ComponentFixture<ExpenditureHeadCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenditureHeadCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenditureHeadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
