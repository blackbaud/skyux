import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-demo-page-docs',
  templateUrl: './demo-page-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPageDocsComponent { }
