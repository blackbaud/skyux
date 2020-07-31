import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset-active-two-way.component.fixture.html'
})
export class TabsetActiveTwoWayBindingTestComponent {

  public activeTab: string = '1';

  public onActiveChange(): void { }

}
