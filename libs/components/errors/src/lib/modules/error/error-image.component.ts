import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies an image to display with the error message.
 */
@Component({
  selector: 'sky-error-image',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyErrorImageComponent {}
