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

import { Subject, takeUntil } from 'rxjs';

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
        SkyThemeSpacing.presets.standard,
        new SkyThemeBrand('blackbaud', '1.0.0'),
      );
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
  #fontLoadingService = inject(FontLoadingService);
  #ngUnsubscribe = new Subject();
  #themeService: SkyThemeService;
  #renderer: Renderer2;

  protected ready = toSignal(this.#fontLoadingService.ready(true));

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

    this.#themeService.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((newSettings) => {
        this.ready = toSignal(
          this.#fontLoadingService.ready(true, newSettings.currentSettings),
        );
      });
  }

  public ngOnDestroy(): void {
    this.#themeService.destroy();
  }
}
