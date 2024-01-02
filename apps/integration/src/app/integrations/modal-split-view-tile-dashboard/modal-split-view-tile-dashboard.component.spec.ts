import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSplitViewTileDashboardComponent } from './modal-split-view-tile-dashboard.component';

describe('ModalSplitViewTileDashboardComponent', () => {
  let component: ModalSplitViewTileDashboardComponent;
  let fixture: ComponentFixture<ModalSplitViewTileDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSplitViewTileDashboardComponent],
    });
    fixture = TestBed.createComponent(ModalSplitViewTileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
