import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SkyDocsPillModule } from '../pill/pill.module';

import { SkyTableOfContentsLink } from './table-of-contents-links';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, JsonPipe, SkyDocsPillModule],
  selector: 'sky-toc',
  styleUrl: './table-of-contents.component.scss',
  templateUrl: './table-of-contents.component.html',
})
export class SkyTableOfContentsComponent {
  public headingText = input.required<string>();
  public links = input.required<SkyTableOfContentsLink[]>();
}
