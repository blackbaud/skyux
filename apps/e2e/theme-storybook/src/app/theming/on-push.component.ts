import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-on-push',
  templateUrl: './on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushComponent {
  @Input()
  public displayText: string | undefined;
}
