import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile2',
  templateUrl: './tile2.component.html',
})
export class Tile2Component {
  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }

  protected onHelpClick($event: MouseEvent): void {
    $event.stopPropagation();
  }
}
