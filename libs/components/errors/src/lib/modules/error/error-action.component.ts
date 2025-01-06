import { Component } from '@angular/core';

/**
 * Specifies an interactive element to include with the error message.
 * For example, you can include a button to reload the page or to refresh data.
 */
@Component({
  selector: 'sky-error-action',
  template: '<ng-content />',
  standalone: false,
})
export class SkyErrorActionComponent {}
