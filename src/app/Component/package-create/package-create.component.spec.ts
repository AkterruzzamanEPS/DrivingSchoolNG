import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCreateComponent } from './package-create.component';

describe('PackageCreateComponent', () => {
  let component: PackageCreateComponent;
  let fixture: ComponentFixture<PackageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
