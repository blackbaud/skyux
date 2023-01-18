import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { FontLoadingTestingModule } from '../shared/font-loading/testing/font-loading-testing.module';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { AgGridStoriesModule } from './ag-grid-stories.module';

describe('DataGridComponent', () => {
  let component: AgGridStoriesComponent;
  let fixture: ComponentFixture<AgGridStoriesComponent>;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

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
    TestBed.configureTestingModule({
      imports: [AgGridStoriesModule, FontLoadingTestingModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
    fixture = TestBed.createComponent(AgGridStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
