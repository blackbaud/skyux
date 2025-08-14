import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyTheme,
  SkyThemeBrand,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSpacing,
} from '@skyux/theme';

import { FontLoadingService } from '../font-loading/font-loading.service';

import { PreviewWrapperThemeValue } from './preview-wrapper-theme-value';

@Component({
  selector: 'sky-preview-wrapper',
  templateUrl: './preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PreviewWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public set theme(value: PreviewWrapperThemeValue | undefined) {
    const themeOrDefault = value ?? 'default';
    if (themeOrDefault.match(/^modern-v2(-(light|dark))?$/)) {
      if (themeOrDefault.includes('dark')) {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.dark,
          SkyThemeSpacing.presets.standard,
        );
      } else {
        this.themeSettings = new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
          SkyThemeSpacing.presets.standard,
        );
      }
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

  protected ready = toSignal(inject(FontLoadingService).ready());

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
}
