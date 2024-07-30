import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import {
  ColGroupDef,
  ColumnGroup,
  ProvidedColumnGroup,
} from 'ag-grid-community';

import { SkyAgGridHeaderGroupParams } from '../types/header-group-params';

import { SkyAgGridHeaderGroupComponent } from './header-group.component';

@Component({
  template: `<span class="test-help-component">Help text</span>`,
})
class TestHelpComponent {}

interface mockEventParam {
  columnGroups: ProvidedColumnGroup[];
}

describe('SkyAgGridHeaderGroupComponent', () => {
  let component: SkyAgGridHeaderGroupComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderGroupComponent>;
  let events: Record<string, ((value: mockEventParam) => void)[]>;
  let expanded: boolean;
  let providedColumnGroup: ProvidedColumnGroup;
  const baseProvidedColumnGroup = {
    isExpanded: (): boolean => expanded,
    isExpandable: (): boolean => true,
  };
  const baseParams = {
    displayName: 'Test Column',
    api: {
      addEventListener: (
        eventType: string,
        listener: (value: mockEventParam) => void,
      ) => {
        events[eventType] = events[eventType] || [];
        events[eventType].push(listener);
      },
      removeEventListener: (
        eventType: string,
        listener: (value: mockEventParam) => void,
      ) => {
        events[eventType] = events[eventType] || [];
        events[eventType] = events[eventType].filter((l) => l !== listener);
      },
    },
    columnGroup: {
      getProvidedColumnGroup: () => providedColumnGroup,
    },
    setExpanded: (open: boolean) => {
      expanded = open;
      (events['columnGroupOpened'] || []).forEach((l) =>
        l({ columnGroups: [providedColumnGroup] }),
      );
    },
  } as unknown as SkyAgGridHeaderGroupParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyAgGridHeaderGroupComponent, TestHelpComponent],
      imports: [SkyI18nModule, SkyIconModule, SkyThemeModule],
      providers: [],
    });
    events = {};
    expanded = false;
    providedColumnGroup = {
      ...baseProvidedColumnGroup,
    } as unknown as ProvidedColumnGroup;

    fixture = TestBed.createComponent(SkyAgGridHeaderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    component.agInit(undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(By.css('.header-group-text')).properties[
        'innerText'
      ],
    ).toBeFalsy();
    providedColumnGroup = {
      ...baseProvidedColumnGroup,
      isExpandable: () => false,
    } as unknown as ProvidedColumnGroup;
    component.agInit({
      ...baseParams,
      columnGroup: {
        ...baseParams.columnGroup,
        getColGroupDef: () =>
          ({
            headerGroupComponent: undefined,
          }) as unknown as ColGroupDef,
      } as unknown as ColumnGroup,
    });
  });

  it('should expand and collapse', async () => {
    component.agInit({
      ...baseParams,
      columnGroup: {
        ...baseParams.columnGroup,
        getColGroupDef: () =>
          ({
            headerGroupComponent: SkyAgGridHeaderGroupComponent,
            headerGroupComponentParams: {
              inlineHelpComponent: TestHelpComponent,
            },
          }) as ColGroupDef,
      } as unknown as ColumnGroup,
    });
    component.ngAfterViewInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(By.css('.test-help-component')),
    ).toBeTruthy();
    component.setExpanded(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(expanded).toBeTruthy();
  });
});
