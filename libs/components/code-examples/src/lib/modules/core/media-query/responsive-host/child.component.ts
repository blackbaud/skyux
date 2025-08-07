import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `<p>Breakpoint for child: {{ breakpoint() }}</p>`,
})
export class DemoChildComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
