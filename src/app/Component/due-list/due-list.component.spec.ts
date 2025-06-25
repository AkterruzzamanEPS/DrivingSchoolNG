import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueListComponent } from './due-list.component';

describe('DueListComponent', () => {
  let component: DueListComponent;
  let fixture: ComponentFixture<DueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
