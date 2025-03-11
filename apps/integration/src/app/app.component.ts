import { Component, Renderer2, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FontLoadingService } from '@skyux/storybook/font-loading';
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
  standalone: false,
})
export class AppComponent {
  public title = 'integration';
  protected ready = toSignal(inject(FontLoadingService).ready(true));

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
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
