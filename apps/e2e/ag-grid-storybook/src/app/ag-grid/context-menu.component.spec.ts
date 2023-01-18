import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererParams } from 'ag-grid-community';

import { ContextMenuComponent } from './context-menu.component';

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextMenuComponent>;
  let component: ContextMenuComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent],
      imports: [SkyDropdownModule],
    });
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    component.agInit({
      data: {
        name: 'test',
      },
    } as ICellRendererParams);
    expect(component.refresh()).toBeFalsy();
    const alertSpy = jest
      .spyOn(window, 'alert')
      .mockImplementation(() => undefined);
    component.actionClicked('test');
    expect(alertSpy).toHaveBeenCalledWith('test clicked for test');
  });
});
