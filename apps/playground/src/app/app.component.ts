import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyAppViewportService,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public height = 80;
  public intervalId;

  public windowObs = new Subject<number>();
  public visualObs = new Subject<number>();

  public windowHeight;
  public visualHeight;

  constructor(
    private router: Router,
    renderer: Renderer2,
    themeService: SkyThemeService,
    viewportService: SkyAppViewportService
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
        SkyThemeMode.presets.light
      )
    );

    this.intervalId = setInterval(() => {
      this.windowObs.next(window.innerHeight);
      this.visualObs.next(window.visualViewport.height);
    }, 1000);
  }

  ngOnInit() {
    this.windowObs.subscribe((x) => {
      this.windowHeight = x;
    });
    this.visualObs.subscribe((x) => {
      this.visualHeight = x;
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  public isHome(): boolean {
    return this.router.url === '/';
  }
}
