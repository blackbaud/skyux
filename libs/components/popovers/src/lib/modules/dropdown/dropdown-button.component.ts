import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the button for the dropdown menu.
 */
@Component({
  selector: 'sky-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyDropdownButtonComponent {}
