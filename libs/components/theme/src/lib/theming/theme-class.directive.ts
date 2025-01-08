import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyThemeSettings } from './theme-settings';
import { SkyThemeService } from './theme.service';

type SkyThemeClassMap = Record<string, string>;

/**
 * Component to add classes conditionally based on the current theme.
 *
 * If the directive is within a `skyTheme` directive, it uses settings from that directive.
 */
@Directive({
  selector: '[skyThemeClass]',
  standalone: false,
})
export class SkyThemeClassDirective implements OnDestroy {
  /**
   * The HTML class attribute.
   *
   * @param value
   */
  @Input()
  public set class(value: string | undefined) {
    this.#removeInitialClasses(this.#initialClasses);
    this.#initialClasses = typeof value === 'string' ? value.split(/\s+/) : [];
    this.#applyInitialClasses(this.#initialClasses);
    this.#applySkyThemeClassMap(this.#skyThemeClassMap);
  }

  /**
   * An object with class names in a string for keys, and theme names (e.g. 'default' or 'modern') as values.
   *
   * @param value
   */
  @Input()
  public set skyThemeClass(value: SkyThemeClassMap | undefined) {
    this.#removeSkyThemeClassMap(this.#skyThemeClassMap);
    this.#applyInitialClasses(this.#initialClasses);

    this.#skyThemeClassMap = value as SkyThemeClassMap;

    /* istanbul ignore else */
    if (this.#skyThemeClassMap) {
      this.#applySkyThemeClassMap(this.#skyThemeClassMap);
    }
  }

  set #themeSettings(settings: SkyThemeSettings) {
    this.#currentTheme = settings;
    this.#removeSkyThemeClassMap(this.#skyThemeClassMap);
    this.#applyInitialClasses(this.#initialClasses);
    this.#applySkyThemeClassMap(this.#skyThemeClassMap);
  }

  #currentTheme: SkyThemeSettings | undefined;
  #ngUnsubscribe = new Subject<void>();
  #initialClasses: string[] = [];
  #skyThemeClassMap: SkyThemeClassMap | undefined;

  #ngEl: ElementRef;
  #renderer: Renderer2;

  constructor(
    ngEl: ElementRef,
    renderer: Renderer2,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#ngEl = ngEl;
    this.#renderer = renderer;
    if (themeSvc) {
      themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((settingsChange) => {
          this.#themeSettings = settingsChange.currentSettings;
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #applyInitialClasses(classes: string[]): void {
    /* istanbul ignore else */
    if (classes) {
      classes.forEach((className) => this.#toggleClass(className, true));
    }
  }

  #applySkyThemeClassMap(skyThemeClassMap: SkyThemeClassMap | undefined): void {
    if (skyThemeClassMap) {
      const themeName = this.#currentTheme?.theme.name || 'default';
      Object.keys(skyThemeClassMap).forEach((className) => {
        const enabled = themeName === skyThemeClassMap[className];
        this.#toggleClass(className, enabled);
      });
    }
  }

  #removeInitialClasses(classes: string[]): void {
    /* istanbul ignore else */
    if (classes) {
      classes.forEach((className) => this.#toggleClass(className, false));
    }
  }

  #removeSkyThemeClassMap(
    skyThemeClassMap: SkyThemeClassMap | undefined,
  ): void {
    if (skyThemeClassMap) {
      Object.keys(skyThemeClassMap).forEach((className) =>
        this.#toggleClass(className, false),
      );
    }
  }

  #toggleClass(className: string, enabled: boolean): void {
    className = className.trim();
    /* istanbul ignore else */
    if (className) {
      className.split(/\s+/g).forEach((classNameItem) => {
        if (enabled) {
          this.#renderer.addClass(this.#ngEl.nativeElement, classNameItem);
        } else {
          this.#renderer.removeClass(this.#ngEl.nativeElement, classNameItem);
        }
      });
    }
  }
}
