import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SkyAppViewportService } from '@skyux/theme';

import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[style.--playground-controls-height]': 'height + "px"',
  },
  imports: [RouterLink, SkyThemeSelectorComponent, RouterOutlet],
})
export class AppComponent {
  public height = 80;

  readonly #router = inject(Router);

  constructor() {
    inject(SkyAppViewportService).reserveSpace({
      id: 'playground-controls',
      position: 'top',
      size: this.height,
    });
  }

  public isHome(): boolean {
    return this.#router.url === '/';
  }
}
