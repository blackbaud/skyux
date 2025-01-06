import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyAgGridHeaderInfo } from '../types/header-info';

@Component({
  selector: 'app-first-inline-help',
  template: `
    <span class="sky-control-help" title="{{ displayName }} help">ℹ︎</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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
    <span class="sky-control-help" title="{{ displayName }} help replaced"
      >ℹ︎</span
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SecondInlineHelpComponent {
  public readonly displayName: string | undefined;

  constructor({ displayName }: SkyAgGridHeaderInfo) {
    this.displayName = displayName;
  }
}
