import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: false,
})
export class DropdownComponent {
  @Input()
  public horizontalAlignment: 'left' | 'right' | 'center' = 'left';

  @Input()
  public buttonStyle: 'default' | 'primary' | 'link' = 'default';

  @Input()
  public disabledFlag = false;

  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
