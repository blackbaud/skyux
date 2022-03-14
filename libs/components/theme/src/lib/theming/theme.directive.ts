import { Directive } from '@angular/core';
import { ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeService } from './theme.service';

const defaultTheme = new SkyThemeSettings(
  SkyTheme.presets.default,
  SkyThemeMode.presets.light
);

/**
 * Creates a new instance of `SkyThemeService` to allow a container
 * to have its own theme.
 */
@Directive({
  selector: '[skyTheme]',
  providers: [SkyThemeService],
})
export class SkyThemeDirective implements OnInit, OnDestroy {
  @Input()
  public set skyTheme(value: SkyThemeSettings | undefined) {
    this._skyTheme = value || defaultTheme;

    if (this.initialized) {
      this.themeSvc.setTheme(this._skyTheme);
    }
  }

  public get skyTheme(): SkyThemeSettings | undefined {
    return this._skyTheme;
  }

  private initialized = false;

  private _skyTheme = defaultTheme;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private themeSvc: SkyThemeService
  ) {}

  public ngOnInit(): void {
    this.themeSvc.init(this.elRef.nativeElement, this.renderer, this.skyTheme!);

    this.initialized = true;
  }

  public ngOnDestroy(): void {
    this.themeSvc.destroy();
  }
}
