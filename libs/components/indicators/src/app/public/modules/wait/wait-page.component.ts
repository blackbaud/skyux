import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-wait-page',
  templateUrl: './wait-page.component.html',
  styleUrls: ['./wait-page.component.scss']
})
export class SkyWaitPageComponent {

  @Input()
  public hasBlockingWait: boolean;

  @Input()
  public hasNonBlockingWait: boolean;
}
