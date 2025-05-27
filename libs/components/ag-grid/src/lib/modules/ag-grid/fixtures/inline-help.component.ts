import { ChangeDetectionStrategy, Component } from '@angular/core';

import type { SkyAgGridHeaderInfo } from '../types/header-info';

@Component({
  selector: 'app-first-inline-help',
  template: `
    <span title="{{ displayName }} help" class="sky-control-help">ℹ︎</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstInlineHelpComponent {
  public readonly displayName: string | undefined;

  constructor({ displayName }: SkyAgGridHeaderInfo) {
    this.displayName = displayName;
  }
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
  public readonly displayName: string | undefined;

  constructor({ displayName }: SkyAgGridHeaderInfo) {
    this.displayName = displayName;
  }
}
