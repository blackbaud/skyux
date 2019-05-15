import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-demo-page-section',
  templateUrl: './demo-page-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDemoPageSectionComponent {

  @Input()
  public heading: string;

}
