import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

type DropdownTypeSettings = {
  buttonType: FormControl<'select' | 'context-menu' | 'tab'>;
  horizontalAlignment: FormControl<'left' | 'right' | 'center'>;
};

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input()
  public buttonType: 'select' | 'context-menu' | 'tab' = 'select';

  @Input()
  public horizontalAlignment: 'left' | 'right' | 'center' = 'left';
}
