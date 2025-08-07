import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-viewkeeper-tabset',
  templateUrl: './viewkeeper-tabset.component.html',
  styleUrls: ['./viewkeeper-tabset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ViewkeeperTabsetComponent {
  public showTabWithViewkeeper = false;
}
