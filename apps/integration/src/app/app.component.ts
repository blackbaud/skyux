import { Component, Renderer2, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { FontLoadingService } from '@skyux/storybook/font-loading';
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
  imports: [RouterLink, SkyThemeSelectorComponent, SkyIconModule, RouterOutlet],
})
export class AppComponent {
  public title = 'integration';
  protected ready = toSignal(inject(FontLoadingService).ready());

  public readonly viewportService = inject(SkyAppViewportService);

  constructor(
    private router: Router,
    renderer: Renderer2,
    themeService: SkyThemeService,
  ) {
    themeService.init(
      document.body,
      renderer,
      new SkyThemeSettings(
        SkyTheme.presets['default'],
        SkyThemeMode.presets.light,
      ),
    );

    this.viewportService.reserveSpace({
      id: 'integration-controls',
      position: 'top',
      size: 80,
    });
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
