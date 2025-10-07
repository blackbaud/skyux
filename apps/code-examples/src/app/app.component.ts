import { NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  NgZone,
  Renderer2,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  SkyAppViewportService,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgStyle, SkyThemeSelectorComponent, RouterOutlet],
})
export class AppComponent implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #zone = inject(NgZone);

  public height = 80;

  constructor(
    renderer: Renderer2,
    public router: Router,
    themeSvc: SkyThemeService,
    viewportSvc: SkyAppViewportService,
  ) {
    viewportSvc.reserveSpace({
      id: 'controls',
      position: 'top',
      size: this.height,
    });

    const themeSettings = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light,
    );

    themeSvc.init(document.body, renderer, themeSettings);
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }

  public ngAfterViewInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const fragment = this.router.parseUrl(event.url).fragment;

          if (fragment) {
            this.#zone.runOutsideAngular(() => {
              const el = document.getElementById(fragment);

              if (el) {
                el.scrollIntoView({
                  behavior: 'smooth',
                });
              }
            });
          }
        }
      });
  }
}
