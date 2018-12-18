import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkySkipLink
} from './skip-link';

import {
  SkySkipLinkAdapterService
} from './skip-link-adapter.service';

@Component({
  selector: 'sky-skip-link-host',
  templateUrl: './skip-link-host.component.html',
  styleUrls: ['./skip-link-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySkipLinkHostComponent {

  public get links(): SkySkipLink[] {
    return this._links;
  }

  public set links(value: SkySkipLink[]) {
    this._links = value;
    this.changeDetector.markForCheck();
  }

  private _links: SkySkipLink[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private adapter: SkySkipLinkAdapterService
  ) { }

  public skipTo(link: SkySkipLink): void {
    this.adapter.skipTo(link);
  }

}
