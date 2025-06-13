import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyFilterBarComponent } from './filter-bar.component';

describe('SkyFilterBarComponent', () => {
  let component: SkyFilterBarComponent;
  let fixture: ComponentFixture<SkyFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyFilterBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
