import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-viewkeeper-test',
  templateUrl: './viewkeeper-test.component.html',
  styleUrls: ['./viewkeeper-test.component.scss'],
  standalone: false,
})
export class ViewkeeperTestComponent {
  public scrollableHost = input(false);

  public showEl1 = input(true);

  public showEl2 = input(true);

  public showEl3 = input(false);

  public showEl4 = input(false);
}
