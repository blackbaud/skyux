import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-flyout-responsive-demo-content',
  templateUrl: './flyout-responsive-demo-content.component.html',
  styleUrls: ['./flyout-responsive-demo-content.component.scss'],
  standalone: false,
})
export class FlyoutResponsiveDemoContentComponent {
  protected readonly currentMediaBreakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
