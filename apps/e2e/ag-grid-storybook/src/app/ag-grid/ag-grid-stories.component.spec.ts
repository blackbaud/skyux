import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { AgGridStoriesModule } from './ag-grid-stories.module';

describe('DataGridComponent', () => {
  let component: AgGridStoriesComponent;
  let fixture: ComponentFixture<AgGridStoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgGridStoriesModule],
    });
    fixture = TestBed.createComponent(AgGridStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
