import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lipsum',
  templateUrl: './lipsum.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LipsumComponent {}
