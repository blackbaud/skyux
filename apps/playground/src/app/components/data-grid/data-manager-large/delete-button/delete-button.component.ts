import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { DataManagerLargeComponent } from '../data-manager-large.component';

@Component({
  selector: 'app-delete-button',
  imports: [SkyIconModule],
  templateUrl: './delete-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonComponent {
  public readonly rowId = input<string>();

  readonly #component = inject(DataManagerLargeComponent);

  protected delete(): void {
    const id = this.rowId();
    if (id) {
      this.#component.markForDelete(id);
    }
  }
}
