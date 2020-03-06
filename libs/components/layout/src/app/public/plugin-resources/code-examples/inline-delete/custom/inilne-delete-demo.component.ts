import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-inline-delete-demo',
  templateUrl: './inline-delete-demo.component.html',
  styleUrls: ['./inline-delete-demo.component.scss']
})
export class InlineDeleteDemoComponent {

  public deleting: boolean = false;

  public pending: boolean = false;

  public deleteItem(): void {
    this.deleting = true;
  }

  public onCancelTriggered(): void {
    this.deleting = false;
  }

  public onDeleteTriggered(): void {
    setTimeout(() => {
      this.pending = false;
    }, 3000);

    this.pending = true;
    this.deleting = false;
  }
}
