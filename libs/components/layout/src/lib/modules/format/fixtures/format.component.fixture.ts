import { Component } from '@angular/core';

@Component({
  selector: 'sky-format-test',
  templateUrl: './format.component.fixture.html',
  standalone: false,
})
export class FormatFixtureComponent {
  public text = '{0} hello {1} {0}.';

  public testClick(): void {}
}
