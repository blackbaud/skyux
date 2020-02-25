import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-viewkeeper-demo',
  templateUrl: './viewkeeper-demo.component.html',
  styleUrls: ['./viewkeeper-demo.component.scss']
})
export class ViewkeeperDemoComponent {

  public el2Visible: boolean;

  public showEl2() {
    this.el2Visible = true;
  }

}
