import {
  Component
} from '@angular/core';

@Component({
  selector: 'card-visual',
  templateUrl: './card-visual.component.html'
})
export class CardVisualComponent {

  public showInlineDelete: boolean = false;

  public triggerInlineDelete(): void {
    this.showInlineDelete = !this.showInlineDelete;
  }
}
