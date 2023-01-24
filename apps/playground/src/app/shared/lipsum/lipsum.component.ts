import { ChangeDetectionStrategy, Component } from '@angular/core';

/* spell-checker:ignore lipsum */
@Component({
  selector: 'app-lipsum',
  templateUrl: './lipsum.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LipsumComponent {}
