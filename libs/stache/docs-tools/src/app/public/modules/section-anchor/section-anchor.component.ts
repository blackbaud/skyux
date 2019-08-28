import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-section-anchor',
  templateUrl: './section-anchor.component.html',
  styleUrls: ['./section-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsSectionAnchorComponent {

  @Input()
  public anchorId: string;

  /**
   * TODO: Think through the name of this component and whether it should be split up into a "section" and an "anchor".
   */

}
