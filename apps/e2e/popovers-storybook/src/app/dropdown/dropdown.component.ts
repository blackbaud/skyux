import { Component, Input } from '@angular/core';

// import { FormControl } from '@angular/forms';

// type DropdownTypeSettings = {
//   buttonType: FormControl<'select' | 'context-menu' | 'tab'>;
//   horizontalAlignment: FormControl<'left' | 'right' | 'center'>;
// };

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input()
  public horizontalAlignment: 'left' | 'right' | 'center' = 'left';

  @Input()
  public buttonStyle: 'default' | 'primary' | 'link' = 'default';

  @Input()
  public disabledFlag: boolean = false;

  public hideButton() {}

  // TODO the next day
  // check data manager for setting up a for loop u iterate through in the cypress file
}
