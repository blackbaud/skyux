import { Component, signal } from '@angular/core';

import { SkyVerticalTabLayoutType } from '../vertical-tab-layout-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset-layout.component.fixture.html',
  standalone: false,
})
export class VerticalTabsetLayoutTestComponent {
  public readonly activeTab = signal(0);
  public readonly tab1Layout = signal<SkyVerticalTabLayoutType | undefined>(
    undefined,
  );
  public readonly tab2Layout = signal<SkyVerticalTabLayoutType | undefined>(
    'fit',
  );
  public readonly tab3Layout = signal<SkyVerticalTabLayoutType | undefined>(
    'blocks',
  );
}
