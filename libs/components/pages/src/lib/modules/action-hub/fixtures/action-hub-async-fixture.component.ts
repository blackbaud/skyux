import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyLink } from '../../link-list/types/link';
import { SkyActionHubModule } from '../action-hub.module';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-async-fixture',
  templateUrl: 'action-hub-async-fixture.component.html',
  imports: [SkyActionHubModule, AsyncPipe],
})
export class ActionHubAsyncFixtureComponent {
  public title = new BehaviorSubject<string>('Page title');
  public needsAttention = new BehaviorSubject<
    SkyActionHubNeedsAttention[] | 'loading'
  >('loading');
  public relatedLinks = new BehaviorSubject<SkyLink[] | 'loading'>('loading');
  public recentLinks = new BehaviorSubject<SkyRecentLink[] | 'loading'>(
    'loading',
  );
}
