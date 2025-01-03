import { Component } from '@angular/core';

import { SkyIconStackItem } from '../icon-stack-item';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon-stack.component.fixture.html',
  standalone: false,
})
export class IconStackTestComponent {
  public baseIcon: SkyIconStackItem = {
    icon: 'circle',
  };

  public topIcon: SkyIconStackItem = {
    icon: 'bell',
  };

  public size: string | undefined;
}
