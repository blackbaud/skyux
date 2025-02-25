import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

type SkyDocsThumbnailCaptionType =
  | 'default'
  | 'info'
  | 'danger'
  | 'warning'
  | 'success';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[ngClass]': '"sky-docs-thumbnail-" + captionType()',
  },
  imports: [NgTemplateOutlet],
  selector: 'sky-docs-thumbnail',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    @if (caption()) {
      <figure>
        <ng-container [ngTemplateOutlet]="imageRef" />
        <figcaption>{{ caption() }}</figcaption>
      </figure>
    } @else {
      <ng-container [ngTemplateOutlet]="imageRef" />
    }

    <ng-template #imageRef>
      <img
        [attr.alt]="imageAlt()"
        [attr.src]="imageSrc()"
        [class.sky-border-dark]="showBorder()"
      />
    </ng-template>
  `,
})
export class SkyDocsThumbnailComponent {
  public caption = input<string | undefined>();
  public captionType = input<SkyDocsThumbnailCaptionType>('default');
  public imageAlt = input<string>('');
  public imageSrc = input.required<string>();
  public showBorder = input(false, { transform: booleanAttribute });
}
