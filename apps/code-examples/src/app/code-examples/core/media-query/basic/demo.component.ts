import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  imports: [CommonModule, SkyIconModule],
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
