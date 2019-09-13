import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-heading-anchor',
  templateUrl: './heading-anchor.component.html',
  styleUrls: ['./heading-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsHeadingAnchorComponent {

  @Input()
  public anchorId: string;

  @Input()
  public headingLevel = '2';

  public get classList(): string {
    const classList: string[] = [
      `sky-docs-h${this.headingLevel}`
    ];
    return classList.join(' ');
  }

}
