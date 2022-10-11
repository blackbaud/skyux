import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SkyAgGridHeader, SkyAgGridHeaderInfo } from '@skyux/ag-grid';

@Component({
  selector: 'app-first-inline-help',
  template: `
    <span class="sky-control-help" title="{{ displayName }} help">ℹ︎</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstInlineHelpComponent {
  public readonly displayName: string;

  constructor(
    @Inject(SkyAgGridHeader)
    { displayName }: SkyAgGridHeaderInfo
  ) {
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
})
export class SecondInlineHelpComponent {
  public readonly displayName: string;

  constructor(
    @Inject(SkyAgGridHeader)
    { displayName }: SkyAgGridHeaderInfo
  ) {
    this.displayName = displayName;
  }
}
