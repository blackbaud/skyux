import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { DemoChildComponent } from './child.component';
import { DemoContainerComponent } from './container.component';

@Component({
  imports: [
    CommonModule,
    DemoChildComponent,
    DemoContainerComponent,
    SkyResponsiveHostDirective,
    SkyIconModule,
  ],
  selector: 'app-demo',
  styleUrl: './demo.component.scss',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
