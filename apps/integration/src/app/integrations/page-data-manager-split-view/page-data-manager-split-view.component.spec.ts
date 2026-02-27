import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDataManagerSplitViewComponent } from './page-data-manager-split-view.component';

describe('PageDataManagerSplitViewComponent', () => {
  let component: PageDataManagerSplitViewComponent;
  let fixture: ComponentFixture<PageDataManagerSplitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PageDataManagerSplitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
