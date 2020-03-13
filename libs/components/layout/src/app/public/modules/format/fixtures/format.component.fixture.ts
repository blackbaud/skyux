import {
  Component
} from '@angular/core';

@Component({
  selector: 'format-test',
  templateUrl: './format.component.fixture.html'
})
export class FormatFixtureComponent {

  public text = '{0} hello {1} {0}.';

  public testClick(): void { }

}
