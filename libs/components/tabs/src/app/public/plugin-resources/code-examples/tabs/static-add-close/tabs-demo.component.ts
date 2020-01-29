import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tabs-demo',
  templateUrl: './tabs-demo.component.html'
})
export class TabsDemoComponent {

  public showTab3: boolean = true;

  public onNewTabClick(): void {
    console.log('Add tab clicked!');
  }
}
