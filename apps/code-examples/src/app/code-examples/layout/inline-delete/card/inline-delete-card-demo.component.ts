import { Component } from '@angular/core';

@Component({
  selector: 'app-inline-delete-card-demo',
  templateUrl: './inline-delete-card-demo.component.html',
})
export class InlineDeleteCardDemoComponent {
  public deleting = false;

  public pending = false;

  public deleteItem(): void {
    this.deleting = true;
  }

  public onCancelTriggered(): void {
    this.deleting = false;
  }

  public onDeleteTriggered(): void {
    setTimeout(() => {
      this.pending = false;
      this.deleting = false;
      alert(
        'Card element deletion was triggered. In a real scenario the item would be removed. Item was not removed just for demo purposes.'
      );
    }, 3000);

    this.pending = true;
  }
}
