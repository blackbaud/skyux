import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyToolbarFilterComponent } from './toolbar-filter.component';

describe('SkyToolbarFilterComponent', () => {
  let component: SkyToolbarFilterComponent;
  let fixture: ComponentFixture<SkyToolbarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyToolbarFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyToolbarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
