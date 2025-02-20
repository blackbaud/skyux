import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';
import { SkyThemeService } from '@skyux/theme';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent {
  public theme = 'default';
  public activeViewId = 'table';

  #themeSvc = inject(SkyThemeService);

  protected ready = toSignal(inject(FontLoadingService).ready(true));

  constructor() {
    this.#themeSvc.settingsChange.subscribe((change) => {
      this.theme = change.currentSettings.theme.name;
    });
  }
}
