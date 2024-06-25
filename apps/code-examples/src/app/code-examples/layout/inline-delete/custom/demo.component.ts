import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyInlineDeleteModule } from '@skyux/layout';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [CommonModule, SkyIconModule, SkyInlineDeleteModule],
})
export class DemoComponent {
  protected deleting = false;
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
        'Custom element deletion was triggered. In a real scenario the item would be removed. Item was not removed just for demo purposes.',
      );
    }, 3000);

    this.pending = true;
  }
}
