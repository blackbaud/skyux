import {
  Component,
  Injector,
  Renderer2,
  afterNextRender,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  SkyAppViewportService,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  #injector = inject(Injector);

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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.parseUrl(event.url).fragment;

        if (fragment) {
          afterNextRender(
            {
              write: () => {
                const el = document.getElementById(fragment);

                if (el) {
                  el.scrollIntoView({
                    behavior: 'smooth',
                  });
                }
              },
            },
            { injector: this.#injector },
          );
        }
      }
    });

    // this.#activatedRoute.fragment
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((fragment) => {
    //     if (fragment) {
    //       afterNextRender(
    //         {
    //           write: () => {
    //             const el = document.getElementById(fragment);

    //             if (el) {
    //               el.scrollIntoView({
    //                 behavior: 'smooth',
    //               });
    //             }
    //           },
    //         },
    //         { injector: this.#injector },
    //       );
    //     }
    //   });
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
