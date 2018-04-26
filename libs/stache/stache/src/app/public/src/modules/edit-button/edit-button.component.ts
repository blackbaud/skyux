import { Component, OnInit } from '@angular/core';

import { StacheConfigService, StacheRouteService } from '../shared';

const _get = require('lodash.get');

@Component({
  selector: 'stache-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class StacheEditButtonComponent implements OnInit {
  public editButtonText: string;
  public url: string;

  private readonly githubFilePathRoot: string = '/tree/master/src/app';
  private readonly vstsBranchSelector: string = '&version=GBmaster';
  private readonly vstsFilePathRoot: string = '?path=%2Fsrc%2Fapp';

  constructor(
    private config: StacheConfigService,
    private routeService: StacheRouteService
  ) { }

  public ngOnInit() {
    this.url = this.getUrl();
    this.editButtonText = _get(this.config, 'skyux.appSettings.stache.editButton.text', 'Edit');
  }

  private getUrl(): string {
    const base = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    if (!base) {
      return '';
    }
    const type = base.includes('visualstudio') ? 'vsts' : 'github';
    const activeUrl = this.routeService.getActiveUrl();
    const frag = encodeURIComponent(activeUrl === '/' ? activeUrl : activeUrl + '/');

    if (type === 'vsts') {
      return base + this.vstsFilePathRoot + frag + 'index.html' + this.vstsBranchSelector;
    } else {
      return base + this.githubFilePathRoot + frag + 'index.html';
    }
  }
}
