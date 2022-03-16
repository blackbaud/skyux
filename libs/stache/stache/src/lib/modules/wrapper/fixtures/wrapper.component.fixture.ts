import {
  Component,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './wrapper.component.fixture.html'
})
export class StacheWrapperTestComponent {
  public heading = 'Second Heading';

  @ViewChild('testWrapper', {
    static: false
  })
  public testWrapper: any;

  public inPageRoutes: any[];
}
