import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  Renderer2
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyThemeSettings
} from './theme-settings';

import {
  SkyThemeService
} from './theme.service';

type SkyThemeClassMap = {[key: string]: string};

/**
 * Component to add classes conditionally based on the current theme.
 *
 * If the directive is within a `skyTheme` directive, it uses settings from that directive.
 */
@Directive({
  selector: '[skyThemeClass]'
})
export class SkyThemeClassDirective implements OnDestroy {
  /**
   * The HTML class attribute.
   *
   * @param value
   */
  @Input('class')
  public set className(value: string) {
    this.removeInitialClasses(this.initialClasses);
    this.initialClasses = typeof value === 'string' ? value.split(/\s+/) : [];
    this.applyInitialClasses(this.initialClasses);
    this.applySkyThemeClassMap(this.skyThemeClassMap);
  }

  /**
   * An object with class names in a string for keys, and theme names (e.g. 'default' or 'modern') as values.
   *
   * @param value
   */
  @Input('skyThemeClass')
  public set skyThemeClass(value: SkyThemeClassMap) {
    this.removeSkyThemeClassMap(this.skyThemeClassMap);
    this.applyInitialClasses(this.initialClasses);

    this.skyThemeClassMap = value as SkyThemeClassMap;

    if (this.skyThemeClassMap) {
      this.applySkyThemeClassMap(this.skyThemeClassMap);
    }
  }

  private set themeSettings(settings: SkyThemeSettings) {
    this.currentTheme = settings;
    this.removeSkyThemeClassMap(this.skyThemeClassMap);
    this.applyInitialClasses(this.initialClasses);
    this.applySkyThemeClassMap(this.skyThemeClassMap);
  }

  private currentTheme: SkyThemeSettings | undefined;
  private ngUnsubscribe = new Subject();
  private initialClasses: string[] = [];
  private skyThemeClassMap: SkyThemeClassMap;

  constructor(
    private ngEl: ElementRef,
    private renderer: Renderer2,
    @Optional() themeSvc?: SkyThemeService
  ) {
    if (themeSvc) {
      themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(settingsChange => {
          this.themeSettings = settingsChange.currentSettings;
        });
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private applyInitialClasses(classes: string[]): void {
    if (classes) {
      classes.forEach(className => this.toggleClass(className, true));
    }
  }

  private applySkyThemeClassMap(skyThemeClassMap: SkyThemeClassMap): void {
    if (skyThemeClassMap) {
      const themeName = this.currentTheme?.theme.name || 'default';
      Object.keys(skyThemeClassMap).forEach(className => {
        const enabled = themeName === skyThemeClassMap[className];
        this.toggleClass(className, enabled);
      });
    }
  }

  private removeInitialClasses(classes: string[]): void {
    if (classes) {
      classes.forEach(className => this.toggleClass(className, false));
    }
  }

  private removeSkyThemeClassMap(skyThemeClassMap: SkyThemeClassMap): void {
    if (skyThemeClassMap) {
      Object.keys(skyThemeClassMap).forEach(className => this.toggleClass(className, false));
    }
  }

  private toggleClass(className: string, enabled: boolean): void {
    className = className.trim();
    if (className) {
      className.split(/\s+/g).forEach(classNameItem => {
        if (enabled) {
          this.renderer.addClass(this.ngEl.nativeElement, classNameItem);
        } else {
          this.renderer.removeClass(this.ngEl.nativeElement, classNameItem);
        }
      });
    }
  }
}
