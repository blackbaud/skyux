import {
  async,
  TestBed
} from '@angular/core/testing';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange
} from '@skyux/theme';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyTilesModule
} from '../tiles.module';

import {
  TileContentSectionTestComponent
} from './fixtures/tile-content-section.component.fixture';

describe('Tile content section component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: new SkyThemeSettings(
            SkyTheme.presets.default,
            SkyThemeMode.presets.light
          ),
          previousSettings: undefined
        }
      )
    };

    TestBed.configureTestingModule({
      declarations: [
        TileContentSectionTestComponent
      ],
      imports: [
        BrowserModule,
        SkyTilesModule
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc
        }
      ]
    });
  });

  it('should render the section content in the expected element', () => {
    let fixture = TestBed.createComponent(TileContentSectionTestComponent);
    let el = fixture.nativeElement;

    fixture.detectChanges();

    expect(
      el.querySelectorAll('.sky-tile-content-section .test-content').length
    ).toBe(1);
  });

  it('should pass accessibility', async(() => {
    let fixture = TestBed.createComponent(TileContentSectionTestComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
