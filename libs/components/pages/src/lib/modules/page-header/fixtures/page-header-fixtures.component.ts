import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
} from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyAlertModule } from '@skyux/indicators';

import { SkyPageHeaderModule } from '../page-header.module';

@Component({
  selector: 'sky-page-header-fixtures',
  imports: [SkyAlertModule, SkyAvatarModule, SkyPageHeaderModule],
  templateUrl: './page-header-fixtures.component.html',
})
export class PageHeaderFixturesComponent {
  @ViewChild('pageHeader', { read: ElementRef })
  public pageHeaderEl: ElementRef | undefined;

  @Input()
  @HostBinding('style.width.px')
  public width = 512;

  protected spokeTitle = 'Page Title';
  protected hubLink = {
    label: 'Parent Link',
    permalink: {
      url: '#',
    },
  };

  public showButtons = false;
  public showAvatar = false;
  public showAlert = false;
}
