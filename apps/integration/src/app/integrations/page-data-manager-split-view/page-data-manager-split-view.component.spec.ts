import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PageDataManagerSplitViewComponent } from './page-data-manager-split-view.component';

describe('PageDataManagerSplitViewComponent', () => {
  let component: PageDataManagerSplitViewComponent;
  let fixture: ComponentFixture<PageDataManagerSplitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageDataManagerSplitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
