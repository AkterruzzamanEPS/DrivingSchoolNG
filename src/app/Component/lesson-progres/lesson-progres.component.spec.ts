import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonProgresComponent } from './lesson-progres.component';

describe('LessonProgresComponent', () => {
  let component: LessonProgresComponent;
  let fixture: ComponentFixture<LessonProgresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonProgresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonProgresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
