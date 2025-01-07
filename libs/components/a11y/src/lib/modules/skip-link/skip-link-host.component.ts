import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

import { SkyA11yResourcesModule } from '../shared/sky-a11y-resources.module';

import { SkySkipLink } from './skip-link';
import { SkySkipLinkAdapterService } from './skip-link-adapter.service';

@Component({
  selector: 'sky-skip-link-host',
  templateUrl: './skip-link-host.component.html',
  styleUrls: ['./skip-link-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkySkipLinkAdapterService],
  imports: [SkyA11yResourcesModule],
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

  readonly #adapter = inject(SkySkipLinkAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);

  public skipTo(link: SkySkipLink): void {
    this.#adapter.skipTo(link);
  }
}
