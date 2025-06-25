import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureCreateComponent } from './expenditure-create.component';

describe('ExpenditureCreateComponent', () => {
  let component: ExpenditureCreateComponent;
  let fixture: ComponentFixture<ExpenditureCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenditureCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenditureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
