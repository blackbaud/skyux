import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo-page-section',
  templateUrl: './demo-page-section.component.html',
  styleUrls: ['./demo-page-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageSectionComponent {

  @Input()
  public heading: string;

}
