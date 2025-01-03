import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeService } from './theme.service';

const defaultTheme = new SkyThemeSettings(
  SkyTheme.presets.default,
  SkyThemeMode.presets.light,
);

/**
 * Creates a new instance of `SkyThemeService` to allow a container
 * to have its own theme.
 */
@Directive({
  selector: '[skyTheme]',
  providers: [SkyThemeService],
  standalone: false,
})
export class SkyThemeDirective implements OnInit, OnDestroy {
  @Input()
  public set skyTheme(value: SkyThemeSettings | undefined) {
    this.skyThemeOrDefault = value || defaultTheme;

    if (this.#initialized) {
      this.#themeSvc.setTheme(this.skyThemeOrDefault);
    }
  }

  public skyThemeOrDefault = defaultTheme;

  #initialized = false;

  #elRef: ElementRef;
  #renderer: Renderer2;
  #themeSvc: SkyThemeService;

  constructor(
    elRef: ElementRef,
    renderer: Renderer2,
    themeSvc: SkyThemeService,
  ) {
    this.#elRef = elRef;
    this.#renderer = renderer;
    this.#themeSvc = themeSvc;
  }

  public ngOnInit(): void {
    this.#themeSvc.init(
      this.#elRef.nativeElement,
      this.#renderer,
      this.skyThemeOrDefault,
    );

    this.#initialized = true;
  }

  public ngOnDestroy(): void {
    this.#themeSvc.destroy();
  }
}
