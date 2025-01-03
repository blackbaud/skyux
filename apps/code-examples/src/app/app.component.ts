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
})
export class AppComponent {
  public height = 60;

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
}
