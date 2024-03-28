import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sky-help-inline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.css'],
})
export class HelpInlineComponent {
  @Input()
  public ariaLabel: string | undefined;
}
