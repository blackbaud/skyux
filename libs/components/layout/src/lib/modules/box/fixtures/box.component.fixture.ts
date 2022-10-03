import { Component } from '@angular/core';

@Component({
  selector: 'sky-box-test',
  templateUrl: 'box.component.fixture.html',
})
export class BoxTestComponent {
  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;
  public ariaRole: string | undefined;
}
