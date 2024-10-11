import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

@Component({
  host: {
    '[class]': '"my-breakpoint-" + breakpoint()',
  },
  imports: [CommonModule],
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
