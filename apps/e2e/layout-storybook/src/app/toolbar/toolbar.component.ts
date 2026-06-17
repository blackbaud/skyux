import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ToolbarComponent {
  public theme = 'default';
  public activeViewId = 'table';

  #themeSvc = inject(SkyThemeService);

  constructor() {
    this.#themeSvc.settingsChange.subscribe((change) => {
      this.theme = change.currentSettings.theme.name;
    });
  }
}
