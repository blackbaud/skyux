import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyIdModule, SkyLogService, SkyTrimModule } from '@skyux/core';

import { SkyFileAttachmentLabelService } from './file-attachment-label.service';

/**
 * Displays a label above the file attachment element. To display a help button
 * beside the label, include a help button element, such as `sky-help-inline`,
 * in the `sky-file-attachment-label` element and a `sky-control-help` CSS class
 * on that help button element.
 * @deprecated Use the `labelText` input on the single file attachment component
 * instead.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyIdModule, SkyTrimModule],
  selector: 'sky-file-attachment-label',
  standalone: true,
  styleUrl: 'file-attachment-label.component.scss',
  templateUrl: './file-attachment-label.component.html',
})
export class SkyFileAttachmentLabelComponent implements OnInit {
  @ViewChild('labelContentId', { read: ElementRef, static: true })
  public labelContentRef: ElementRef | undefined;

  readonly #labelSvc = inject(SkyFileAttachmentLabelService, {
    optional: true,
    skipSelf: true,
    host: true,
  });

  constructor() {
    inject(SkyLogService).deprecated('SkyFileAttachmentLabelComponent', {
      deprecationMajorVersion: 9,
      replacementRecommendation:
        'To add a label to single file attachment, use the `labelText` input ' +
        'on the `sky-file-attachment` component instead.',
    });
  }

  public ngOnInit(): void {
    this.#labelSvc?.registerLabelComponent(this);
  }
}
