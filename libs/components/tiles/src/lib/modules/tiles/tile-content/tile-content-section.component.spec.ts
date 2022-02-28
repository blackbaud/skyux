import { TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect, expectAsync } from '@skyux-sdk/testing';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyTilesModule } from '../tiles.module';

import { TileContentSectionTestComponent } from './fixtures/tile-content-section.component.fixture';

describe('Tile content section component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [TileContentSectionTestComponent],
      imports: [NoopAnimationsModule, SkyTilesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  it('should render the section content in the expected element', () => {
    const fixture = TestBed.createComponent(TileContentSectionTestComponent);
    const el = fixture.nativeElement;

    fixture.detectChanges();

    expect(
      el.querySelectorAll('.sky-tile-content-section .test-content').length
    ).toBe(1);
  });

  it('should pass accessibility', async () => {
    const fixture = TestBed.createComponent(TileContentSectionTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
