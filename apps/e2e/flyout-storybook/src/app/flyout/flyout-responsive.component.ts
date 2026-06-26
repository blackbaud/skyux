import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-flyout-responsive',
  templateUrl: './flyout-responsive.component.html',
  styleUrls: ['./flyout-responsive.component.scss'],
  standalone: false,
})
export class FlyoutResponsiveComponent {
  protected readonly currentMediaBreakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
