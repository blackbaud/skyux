import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyInlineDeleteComponent
} from '../inline-delete.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './inline-delete.component.fixture.html',
  styles: [`
    #inline-delete-fixture {
      height: 400px;
      position: relative;
      width: 400px;
    }

    #hidden-button {
      visibility: hidden;
    }
  `]
})
export class InlineDeleteTestComponent {

  public pending = false;

  public showDelete = true;

  public showExtraButtons = false;

  @ViewChild(SkyInlineDeleteComponent)
  public inlineDelete: SkyInlineDeleteComponent;

}
