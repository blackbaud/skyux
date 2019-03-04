import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class SkyNavbarItemComponent {
  @Input()
  public active: boolean;
}
