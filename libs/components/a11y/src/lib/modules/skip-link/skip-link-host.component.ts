import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { SkyA11yResourcesModule } from '../shared/sky-a11y-resources.module';

import { SkySkipLink } from './skip-link';
import { SkySkipLinkAdapterService } from './skip-link-adapter.service';

@Component({
  standalone: true,
  selector: 'sky-skip-link-host',
  templateUrl: './skip-link-host.component.html',
  styleUrls: ['./skip-link-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkySkipLinkAdapterService],
  imports: [CommonModule, SkyA11yResourcesModule],
})
export class SkySkipLinkHostComponent {
  public get links(): SkySkipLink[] {
    return this.#_links;
  }

  public set links(value: SkySkipLink[]) {
    this.#_links = value;
    this.#changeDetector.markForCheck();
  }

  #_links: SkySkipLink[] = [];

  #changeDetector: ChangeDetectorRef;
  #adapter: SkySkipLinkAdapterService;

  constructor(
    changeDetector: ChangeDetectorRef,
    adapter: SkySkipLinkAdapterService
  ) {
    this.#changeDetector = changeDetector;
    this.#adapter = adapter;
  }

  public skipTo(link: SkySkipLink): void {
    this.#adapter.skipTo(link);
  }
}
