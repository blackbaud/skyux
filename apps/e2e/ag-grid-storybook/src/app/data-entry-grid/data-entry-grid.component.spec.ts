import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { DataEntryGridComponent } from './data-entry-grid.component';
import { DataEntryGridModule } from './data-entry-grid.module';

describe('DataEntryGridComponent', () => {
  let component: DataEntryGridComponent;
  let fixture: ComponentFixture<DataEntryGridComponent>;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };
  let events: { [key: string]: (() => void)[] };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: {
          theme: SkyTheme.presets.default,
          mode: SkyThemeMode.presets.light,
        },
        previousSettings: undefined,
      }),
    };
    events = {};
    TestBed.configureTestingModule({
      imports: [DataEntryGridModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
    fixture = TestBed.createComponent(DataEntryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should create edit-lookup variation', async () => {
    component.variation = 'edit-lookup';
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should become ready', async () => {
    Object.values(component.gridOptions).forEach((gridOptions) => {
      gridOptions.onGridReady({
        api: {
          addEventListener: (eventType, listener: () => void) => {
            events[eventType] = events[eventType] || [];
            events[eventType].push(listener);
          },
        },
      } as GridReadyEvent);
    });
    expect(component.isActive$.value).toBe(true);
    component.ngAfterViewInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    events['firstDataRendered'].forEach((listener) => listener());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(component.ready.value).toBe(true);
  });

  it('should use smaller dataset for calendar view in modern theme', async () => {
    component.variation = 'date-and-lookup';
    mockThemeSvc.settingsChange.next({
      currentSettings: {
        theme: SkyTheme.presets.modern,
        mode: SkyThemeMode.presets.light,
      },
      previousSettings: undefined,
    });
    Object.values(component.gridOptions).forEach((gridOptions) => {
      gridOptions.onGridReady({
        api: {
          addEventListener: (eventType, listener: () => void) => {
            events[eventType] = events[eventType] || [];
            events[eventType].push(listener);
          },
        },
      } as GridReadyEvent);
    });
    component.ngAfterViewInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    events['firstDataRendered'].forEach((listener) => listener());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(component.ready.value).toBe(true);
    expect(component.dataSets[0].data.length).toBe(7);
  });
});
