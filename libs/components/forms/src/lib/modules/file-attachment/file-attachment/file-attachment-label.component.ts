import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyIdModule, SkyLogService, SkyTrimModule } from '@skyux/core';

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
  imports: [SkyIdModule, SkyTrimModule],
  selector: 'sky-file-attachment-label',
  styleUrl: 'file-attachment-label.component.scss',
  templateUrl: './file-attachment-label.component.html',
})
export class SkyFileAttachmentLabelComponent {
  @ViewChild('labelContentId')
  public labelContentId: { id: string } | undefined;

  constructor() {
    inject(SkyLogService).deprecated('SkyFileAttachmentLabelComponent', {
      deprecationMajorVersion: 9,
      replacementRecommendation:
        'To add a label to single file attachment, use the `labelText` input ' +
        'on the `sky-file-attachment` component instead.',
    });
  }
}
