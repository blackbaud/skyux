import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
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
  host: {
    '[style.--playground-controls-height]': 'height + "px"',
  },
})
export class AppComponent {
  public height = 80;

  constructor(
    private router: Router,
    renderer: Renderer2,
    themeService: SkyThemeService,
    viewportService: SkyAppViewportService,
  ) {
    viewportService.reserveSpace({
      id: 'playground-controls',
      position: 'top',
      size: this.height,
    });

    themeService.init(
      document.body,
      renderer,
      new SkyThemeSettings(
        SkyTheme.presets['default'],
        SkyThemeMode.presets.light,
      ),
    );
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
