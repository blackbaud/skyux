import { Component, Input } from '@angular/core';

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
}
