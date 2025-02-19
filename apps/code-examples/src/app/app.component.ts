import {
  Component,
  Injector,
  Renderer2,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
  #activatedRoute = inject(ActivatedRoute);
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

    this.#activatedRoute.fragment
      .pipe(takeUntilDestroyed())
      .subscribe((fragment) => {
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
      });
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
