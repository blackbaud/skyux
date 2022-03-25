import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';

  constructor(
    private router: Router,
    renderer: Renderer2,
    themeService: SkyThemeService
  ) {
    themeService.init(
      document.body,
      renderer,
      new SkyThemeSettings(
        SkyTheme.presets['default'],
        SkyThemeMode.presets.light
      )
    );
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
