import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { PreviewWrapperThemeValue } from './preview-wrapper-theme-value';

@Component({
  selector: 'sky-preview-wrapper',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public set theme(value: PreviewWrapperThemeValue | undefined) {
    this.#_theme = value ?? 'default';
    if (this.#_theme && this.#_theme.match(/^modern(-(light|dark))?$/)) {
      if (this.#_theme.includes('dark')) {
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
  public get theme(): PreviewWrapperThemeValue {
    return this.#_theme;
  }

  public get themeSettings(): SkyThemeSettings {
    return this.#_themeSettings;
  }
  public set themeSettings(value: SkyThemeSettings) {
    this.#_themeSettings = value;
    if (this.#initialized) {
      this.#themeService.setTheme(this.#_themeSettings);
    }
  }

  #_themeSettings = new SkyThemeSettings(
    SkyTheme.presets.default,
    SkyThemeMode.presets.light
  );
  #_theme: PreviewWrapperThemeValue = 'default';
  #initialized = false;

  #body: HTMLElement;
  #themeService: SkyThemeService;
  #renderer: Renderer2;

  constructor(
    themeService: SkyThemeService,
    @Inject('BODY') body: HTMLElement,
    renderer: Renderer2
  ) {
    this.#themeService = themeService;
    this.#body = body;
    this.#renderer = renderer;
  }

  public ngOnInit(): void {
    this.#themeService.init(this.#body, this.#renderer, this.themeSettings);
    this.#initialized = true;
  }

  public ngOnDestroy(): void {
    this.#themeService.destroy();
  }
}
