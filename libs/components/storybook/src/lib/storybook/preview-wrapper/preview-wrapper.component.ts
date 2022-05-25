import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sky-preview-wrapper',
  templateUrl: './preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public set theme(value: 'default' | 'modern-light' | 'modern-dark') {
    this._theme = value;
    if (value && value.match(/^(default|modern)(-(light|dark))?$/)) {
      if (value.indexOf('modern') === 0) {
        if (value.includes('dark')) {
          this.themeSettings = new SkyThemeSettings(
            SkyTheme.presets.modern,
            SkyThemeMode.presets.dark
          );
          return;
        } else {
          this.themeSettings = new SkyThemeSettings(
            SkyTheme.presets.modern,
            SkyThemeMode.presets.light
          );
          return;
        }
      }
    }
    this.themeSettings = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light
    );
  }
  public get theme() {
    return this._theme;
  }

  public themeSettings = new SkyThemeSettings(
    SkyTheme.presets.default,
    SkyThemeMode.presets.light
  );

  private _theme?: 'default' | 'modern-light' | 'modern-dark';
  private _ngUnsubscribe = new Subscription();
  private _bodyEl: HTMLElement;

  constructor(
    private themeService: SkyThemeService,
    private windowRef: SkyAppWindowRef
  ) {
    this._bodyEl = this.windowRef.nativeWindow.document.body;
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
  }

  public ngOnInit(): void {
    this._ngUnsubscribe.add(
      this.themeService.settingsChange.subscribe((settings) => {
        if (settings.previousSettings) {
          this._bodyEl.classList.remove(
            settings.previousSettings.theme.hostClass
          );
          this._bodyEl.classList.remove(
            settings.previousSettings.mode.hostClass
          );
        }
        this._bodyEl.classList.add(settings.currentSettings.theme.hostClass);
        this._bodyEl.classList.add(settings.currentSettings.mode.hostClass);
      })
    );
  }
}
