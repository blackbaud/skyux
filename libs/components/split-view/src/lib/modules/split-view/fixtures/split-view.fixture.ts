import { Component, ViewChild } from '@angular/core';
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

  public ariaLabelForDrawer: string | undefined;

  public ariaLabelForWorkspace: string | undefined;

  public backButtonText: string | undefined;

  public bindHeightToWindow = false;

  public hasUnsavedWork = false;

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' },
  ];

  public lowerSplitView = false;

  public showActionBar = false;

  public showIframe = false;

  public splitViewMessageStream = new Subject<SkySplitViewMessage>();

  public width: number | undefined;

  public dock: SkySplitViewDockType | undefined;

  @ViewChild(SkySplitViewComponent)
  public splitViewComponent!: SkySplitViewComponent;

  constructor(public confirmService: SkyConfirmService) {}
}
