import {
  Component
} from '@angular/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  selector: 'sky-modal-content',
  template: '<ng-content></ng-content>'
})
export class SkyModalContentComponent { }
