import { Component, OnInit } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';

import _get from 'lodash.get';

import { StacheRouteService } from '../router/route.service';

@Component({
  selector: 'stache-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss'],
})
export class StacheEditButtonComponent implements OnInit {
  public editButtonText: string;
  public url: string;

  private readonly githubFilePathRoot: string = '/tree/master/src/app';
  private readonly vstsBranchSelector: string = '&version=GBmaster';
  private readonly vstsFilePathRoot: string = '?path=%2Fsrc%2Fapp';

  constructor(
    private config: SkyAppConfig,
    private routeService: StacheRouteService
  ) {}

  public ngOnInit() {
    this.url = this.getUrl();
    this.editButtonText = _get(
      this.config,
      'skyux.appSettings.stache.editButton.text',
      'Edit'
    );
  }

  private getUrl(): string {
    const base = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    if (!base) {
      return '';
    }
    const type =
      base.includes('visualstudio') || base.includes('azure')
        ? 'vsts'
        : 'github';
    const activeUrl = this.routeService.getActiveUrl();
    const frag = encodeURIComponent(
      activeUrl === '/' ? activeUrl : activeUrl + '/'
    );

    if (type === 'vsts') {
      return (
        base +
        this.vstsFilePathRoot +
        frag +
        'index.html' +
        this.vstsBranchSelector
      );
    } else {
      return base + this.githubFilePathRoot + frag + 'index.html';
    }
  }
}
