import { Component, Renderer2 } from '@angular/core';
import {
  SkyAppStyleLoader,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isLoaded" [@.disabled]="true">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  public isLoaded = false;

  constructor(
    renderer: Renderer2,
    themeService: SkyThemeService,
    styleLoader: SkyAppStyleLoader
  ) {
    themeService.init(
      document.body,
      renderer,
      new SkyThemeSettings(
        SkyTheme.presets['default'],
        SkyThemeMode.presets.light
      )
    );

    styleLoader.loadStyles().then(() => {
      this.isLoaded = true;
    });
  }
}
