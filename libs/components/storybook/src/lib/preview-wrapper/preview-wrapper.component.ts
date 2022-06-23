import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sky-preview-wrapper',
  templateUrl: './preview-wrapper.component.html',
  styleUrls: ['./preview-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreviewWrapperComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
    private elementRef: ElementRef,
    private platform: Platform
  ) {
    this._bodyEl = this.elementRef.nativeElement.ownerDocument
      .body as HTMLElement;
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
  }

  public ngOnInit(): void {
    this._ngUnsubscribe.add(
      this.themeService.settingsChange.subscribe(() => {
        this.verifyThemeClasses();
      })
    );
  }

  public ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      this.verifyThemeClasses();
    }
  }

  /**
   * Storybook seems to prevent these classes from applying, so the interval allows for several attempts.
   * @private
   */
  private verifyThemeClasses() {
    this._ngUnsubscribe.add(
      interval(400)
        .pipe(take(10))
        .subscribe(() => {
          if (this.themeSettings) {
            if (
              !this._bodyEl.classList.contains(
                this.themeSettings.theme.hostClass
              ) ||
              !this._bodyEl.classList.contains(
                this.themeSettings.mode.hostClass
              )
            ) {
              const classes: string[] = Array.from(
                this._bodyEl.classList
              ).filter((className) => className.startsWith('sky'));
              this._bodyEl.classList.remove(...classes);
              this._bodyEl.classList.add(
                this.themeSettings.theme.hostClass,
                this.themeSettings.mode.hostClass
              );
            }
          }
        })
    );
  }
}
