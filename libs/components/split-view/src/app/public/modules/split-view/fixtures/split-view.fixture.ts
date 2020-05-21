import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyConfirmService
} from '@skyux/modals';

import {
  Subject
} from 'rxjs';

import {
  SkySplitViewComponent
} from '../split-view.component';

import {
  SkySplitViewMessage
} from '../types/split-view-message';

@Component({
  selector: 'split-view-fixture',
  templateUrl: './split-view.fixture.html'
})
export class SplitViewFixtureComponent {

  public ariaLabelForDrawer: string;

  public ariaLabelForWorkspace: string;

  public backButtonText: string;

  public hasUnsavedWork = false;

  public items = [
    { id: '1', name: 'apple' },
    { id: '2', name: 'banana' },
    { id: '3', name: 'orange' },
    { id: '4', name: 'pear' },
    { id: '5', name: 'strawberry' }
  ];

  public showIframe = false;

  public splitViewMessageStream = new Subject<SkySplitViewMessage>();

  public width: number;

  @ViewChild(SkySplitViewComponent)
  public splitViewComponent: SkySplitViewComponent;

  constructor(
    public confirmService: SkyConfirmService
  ) {}

}
