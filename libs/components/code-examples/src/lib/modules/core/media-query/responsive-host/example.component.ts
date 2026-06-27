import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { DemoChildComponent } from './child.component';
import { DemoContainerComponent } from './container.component';

/**
 * @title Media query service using a responsive host container
 */
@Component({
  imports: [
    CommonModule,
    DemoChildComponent,
    DemoContainerComponent,
    SkyResponsiveHostDirective,
    SkyIconModule,
  ],
  selector: 'app-core-media-query-responsive-host-example',
  styleUrl: './example.component.scss',
  templateUrl: './example.component.html',
})
export class CoreMediaQueryResponsiveHostExampleComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
