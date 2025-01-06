import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-toolbar-standard-items',
  templateUrl: './toolbar-standard-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToolbarStandardItemsComponent {
  public listDescriptor: string | undefined;
}
