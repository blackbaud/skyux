import { Component } from '@angular/core';

@Component({
  selector: 'sky-viewkeeper-test',
  templateUrl: './viewkeeper-test.component.html',
  styleUrls: ['./viewkeeper-test.component.scss'],
  standalone: false,
})
export class ViewkeeperTestComponent {
  public scrollableHost = false;

  public showEl1 = true;

  public showEl2 = true;

  public showEl3 = false;

  public showEl4 = false;
}
