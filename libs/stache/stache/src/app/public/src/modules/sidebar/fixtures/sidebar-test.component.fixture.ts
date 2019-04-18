import {
  Component, Input
} from '@angular/core';

@Component({
  selector: 'sidebar-test-cmp',
  templateUrl: './sidebar-test.component.fixture.html'
})
export class SidebarTestComponent {
  @Input()
  public routes: any[];
}
