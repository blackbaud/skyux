import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyInlineDeleteModule } from '@skyux/layout';

/**
 * @title Inline delete with custom elements
 */
@Component({
  selector: 'app-layout-inline-delete-custom-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [SkyIconModule, SkyInlineDeleteModule],
})
export class LayoutInlineDeleteCustomExampleComponent {
  public deleting = false;
  protected pending = false;

  protected deleteItem(): void {
    this.deleting = true;
  }

  protected onCancelTriggered(): void {
    this.deleting = false;
  }

  protected onDeleteTriggered(): void {
    setTimeout(() => {
      this.pending = false;
      this.deleting = false;

      alert(
        'Custom element deletion was triggered. In a real scenario the item would be removed. Item was not removed just for example purposes.',
      );
    }, 3000);

    this.pending = true;
  }
}
