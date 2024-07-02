import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SkyThemeService } from '../theming/theme.service';

@Directive({
  selector: '[skyThemeClass]',
  standalone: true,
})
export class SkyThemeComponentClassDirective {
  @HostBinding('class')
  public theme = 'sky-cmp-theme-default';

  #changeDetector = inject(ChangeDetectorRef);
  #themeService = inject(SkyThemeService, { optional: true });

  constructor() {
    this.#themeService?.settingsChange
      .pipe(takeUntilDestroyed())
      .subscribe((change) => {
        this.theme = `sky-cmp-theme-${change.currentSettings.theme.name}`;
        this.#changeDetector.markForCheck();
      });
  }
}
