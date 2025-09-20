import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyDefaultInputProvider, SkyMediaQueryService } from '@skyux/core';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

/**
 * Displays an avatar within the page header to the left of the page title.
 * If no size is specified for the avatar component it will display at size
 * small on xs breakpoints and size large on small and above breakpoints.
 */
@Component({
  selector: 'sky-page-header-avatar',
  templateUrl: './page-header-avatar.component.html',
  styleUrls: ['./page-header-avatar.component.scss'],
  providers: [SkyDefaultInputProvider],
  standalone: false,
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyPageHeaderAvatarComponent {
  constructor() {
    const defaultInputProvider = inject(SkyDefaultInputProvider);

    inject(SkyMediaQueryService)
      .breakpointChange.pipe(takeUntilDestroyed())
      .subscribe((breakpoint) => {
        if (breakpoint === 'xs') {
          defaultInputProvider.setValue('avatar', 'size', 'small');
        } else {
          defaultInputProvider.setValue('avatar', 'size', 'large');
        }
      });
  }
}
