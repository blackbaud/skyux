import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyIconModule, SkyThemeModule],
  selector: 'sky-help-inline-icon',
  standalone: true,
  template: `
    <sky-icon *skyThemeIf="'default'" icon="info-circle" />
    <sky-icon-stack
      *skyThemeIf="'modern'"
      size="xs"
      [baseIcon]="{
        icon: 'circle-solid',
        iconType: 'skyux',
      }"
      [topIcon]="{
        icon: 'help-i',
        iconType: 'skyux',
      }"
    />
  `,
})
export class SkyHelpInlineIconComponent {}
