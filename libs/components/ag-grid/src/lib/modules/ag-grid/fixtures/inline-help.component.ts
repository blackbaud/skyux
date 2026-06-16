import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SkyAgGridHeaderInfo } from '../types/header-info';

@Component({
  selector: 'app-first-inline-help',
  template: `
    <span title="{{ displayName }} help" class="sky-control-help">ℹ︎</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstInlineHelpComponent {
  public readonly displayName = inject(SkyAgGridHeaderInfo).displayName;
}

@Component({
  selector: 'app-second-inline-help',
  template: `
    <span title="{{ displayName }} help replaced" class="sky-control-help"
      >ℹ︎</span
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondInlineHelpComponent {
  public readonly displayName = inject(SkyAgGridHeaderInfo).displayName;
}
