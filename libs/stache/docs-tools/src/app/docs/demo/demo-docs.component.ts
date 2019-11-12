import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-demo-docs',
  templateUrl: './demo-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoDocsComponent { }
