import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays an inline code token, such as a file name or property name, within
 * a body of text.
 */
@Component({
  selector: 'sky-code',
  templateUrl: './code.component.html',
  styleUrl: './code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCodeComponent {}
