import { Component } from '@angular/core';

@Component({
  selector: 'app-inline-delete',
  templateUrl: './inline-delete.component.html',
  styles: [
    `
      #screenshot-inline-delete {
        padding: 15px;
        background-color: white;
        height: 400px;
        width: 400px;
        position: relative;
      }
    `,
  ],
})
export class InlineDeleteComponent {
  public deleting = false;
  public pending = false;

  public onCancelTriggered(): void {
    this.deleting = false;
  }

  public onDeleteTriggered(): void {
    this.deleting = false;
  }

  public onShowInlineDeleteClick(): void {
    this.deleting = true;
  }
}
