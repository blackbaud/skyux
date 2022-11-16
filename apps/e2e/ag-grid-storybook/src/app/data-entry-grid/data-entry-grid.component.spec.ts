import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { FontLoadingTestingModule } from '../shared/font-loading/testing/font-loading-testing.module';

import { DataEntryGridComponent } from './data-entry-grid.component';
import { DataEntryGridModule } from './data-entry-grid.module';

describe('DataEntryGridComponent', () => {
  let component: DataEntryGridComponent;
  let fixture: ComponentFixture<DataEntryGridComponent>;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  ['date-and-lookup', 'edit-lookup'].forEach(
    (variation: 'date-and-lookup' | 'edit-lookup') => {
      describe(`variation: ${variation}`, () => {
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
            imports: [DataEntryGridModule, FontLoadingTestingModule],
            providers: [
              {
                provide: SkyThemeService,
                useValue: mockThemeSvc,
              },
            ],
          });
          fixture = TestBed.createComponent(DataEntryGridComponent);
          component = fixture.componentInstance;
          component.variation = variation;
          fixture.detectChanges();
        });

        it('should create', async () => {
          expect(component).toBeTruthy();
        });

        if (variation === 'date-and-lookup') {
          it('should use smaller dataset for calendar view in modern theme', async () => {
            mockThemeSvc.settingsChange.next({
              currentSettings: {
                theme: SkyTheme.presets.modern,
                mode: SkyThemeMode.presets.light,
              },
              previousSettings: undefined,
            });
            component.ngAfterViewInit();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component).toBeTruthy();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            expect(component.ready.value).toBe(true);
            expect(component.dataSets[0].data.length).toBe(7);
          });
        }
      });
    }
  );
});
