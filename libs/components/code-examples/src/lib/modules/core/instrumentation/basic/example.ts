import { Component } from '@angular/core';
import { SkyInstrumentationContext } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Instrumentation context with basic setup
 */
@Component({
  imports: [SkyHelpInlineModule, SkyInstrumentationContext],
  selector: 'app-core-instrumentation-basic-example',
  templateUrl: './example.html',
})
export class CoreInstrumentationBasicExample {
  protected readonly pageContext = { pageId: 'constituent-summary' };
  protected readonly sectionContext = { sectionId: 'giving-history' };
}
