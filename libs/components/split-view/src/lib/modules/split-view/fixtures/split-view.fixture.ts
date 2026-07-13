import { Component, ViewChild, inject, input } from '@angular/core';
import { SkyConfirmService } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SkySplitViewComponent } from '../split-view.component';
import { SkySplitViewDockType } from '../types/split-view-dock-type';
import { SkySplitViewMessage } from '../types/split-view-message';

@Component({
  selector: 'sky-split-view-fixture',
  templateUrl: './split-view.fixture.html',
  standalone: false,
})
export class SplitViewFixtureComponent {
  public additionalItems: string[] = [];

  public ariaLabelForDrawer = input<string | undefined>(undefined);

  public ariaLabelForWorkspace = input<string | undefined>(undefined);

  public backButtonText = input<string | undefined>(undefined);

  public bindHeightToWindow = input<boolean>(false);

  public dock = input<SkySplitViewDockType | undefined>(undefined);

  public hasUnsavedWork = false;

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' },
  ];

  public lowerSplitView = input<boolean>(false);

  public showActionBar = input<boolean>(false);

  public showIframe = input<boolean>(false);

  public splitViewMessageStream = new Subject<SkySplitViewMessage>();

  public width = input<number | undefined>(undefined);

  @ViewChild(SkySplitViewComponent)
  public splitViewComponent!: SkySplitViewComponent;

  public confirmService = inject(SkyConfirmService);
}
