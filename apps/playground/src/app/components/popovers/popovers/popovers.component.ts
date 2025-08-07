import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { SkyPopoverModule } from '@skyux/popovers';

@Component({
  selector: 'app-popovers',
  templateUrl: './popovers.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyPopoverModule, SkyPageModule],
})
export class PopoversComponent {}
