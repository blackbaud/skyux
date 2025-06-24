import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBarItemComponent } from './filter-bar-item.component';

describe('FilterBarItemComponent', () => {
  let component: FilterBarItemComponent;
  let fixture: ComponentFixture<FilterBarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
