import { Component } from '@angular/core';

/**
 * Specifies an action to include in the error message.
 * For example, you can include a button to reload the page or to refresh data.
 */
@Component({
  selector: 'sky-error-action',
  template: '<ng-content></ng-content>',
})
export class SkyErrorActionComponent {}
