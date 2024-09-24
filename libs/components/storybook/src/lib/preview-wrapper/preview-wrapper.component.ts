import {
  ChangeDetectionStrategy,
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

import { PreviewWrapperThemeValue } from './preview-wrapper-theme-value';

@Component({
  selector: 'sky-preview-wrapper',
  template: '<ng-content />',
  styleUrls: ['./preview-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public set theme(value: PreviewWrapperThemeValue | undefined) {
    this.#removeModernV2Class();

    const themeOrDefault = value ?? 'default';
    if (themeOrDefault.match(/^modern(-(light|dark))?$/)) {
      if (themeOrDefault.includes('dark')) {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
        );
      } else {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        );
      }
    } else if (themeOrDefault.includes('v2')) {
      this.themeSettings = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      );
      this.#addModernV2Class();
    } else {
      this.themeSettings = new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      );
    }
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
    SkyThemeMode.presets.light,
  );
  #initialized = false;

  #body: HTMLElement;
  #themeService: SkyThemeService;
  #renderer: Renderer2;

  constructor(
    themeService: SkyThemeService,
    @Inject('BODY') body: HTMLElement,
    renderer: Renderer2,
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

  #addModernV2Class() {
    this.#renderer.addClass(document.body, 'sky-theme-brand-blackbaud');
  }

  #removeModernV2Class() {
    this.#renderer.removeClass(document.body, 'sky-theme-brand-blackbaud');
  }
}
