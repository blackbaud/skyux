import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-angular-tree-context-menu',
  templateUrl: './angular-tree-context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAngularTreeContextMenuComponent {

  // The dropdown component supports enter, space, and arrow keys. This event listener will
  // prevent those keyboard controls from bubbling up to tree view component.
  public onKeydown(e: KeyboardEvent): void {
    const reservedKeys = ['enter', ' ', 'arrowdown', 'arrowup'];
    if (reservedKeys.indexOf(e.key.toLowerCase()) > -1) {
      e.stopPropagation();
    }
  }
}
