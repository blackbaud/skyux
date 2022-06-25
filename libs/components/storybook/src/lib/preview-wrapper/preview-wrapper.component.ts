import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
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
    if (value && value.match(/^modern(-(light|dark))?$/)) {
      if (value.includes('dark')) {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark
        );
      } else {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        );
      }
    } else {
      this.themeSettings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light
      );
    }
  }
  public get theme() {
    return this._theme;
  }

  public get themeSettings(): SkyThemeSettings {
    return this._themeSettings;
  }
  public set themeSettings(value: SkyThemeSettings) {
    this._themeSettings = value;
    if (this.initialized) {
      this.themeService.setTheme(this._themeSettings);
    }
  }

  private _themeSettings = new SkyThemeSettings(
    SkyTheme.presets.default,
    SkyThemeMode.presets.light
  );
  private _theme?: 'default' | 'modern-light' | 'modern-dark';
  private readonly _ngUnsubscribe = new Subscription();
  private initialized = false;

  constructor(
    private themeService: SkyThemeService,
    @Inject('BODY') private body: HTMLElement,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.themeService.init(this.body, this.renderer, this.themeSettings);
    this.initialized = true;
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
    this.themeService.destroy();
    this.renderer.removeClass(this.body, this.themeSettings.theme.hostClass);
    this.renderer.removeClass(this.body, this.themeSettings.mode.hostClass);
  }
}
