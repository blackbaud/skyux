import { Component } from '@angular/core';

import { SkyIconStackItem } from '../icon-stack-item';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon-stack.component.fixture.html',
})
export class IconStackTestComponent {
  public baseIcon: SkyIconStackItem = {
    icon: 'circle',
  };

  public topIcon: SkyIconStackItem = {
    icon: 'bell',
  };

  public size = '3x';
}
