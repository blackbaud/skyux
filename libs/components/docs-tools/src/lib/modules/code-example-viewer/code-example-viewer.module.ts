import {
  EnvironmentProviders,
  NgModule,
  makeEnvironmentProviders,
} from '@angular/core';
import { SkyHelpService } from '@skyux/core';

import { SkyDocsCodeExampleViewerComponent } from './code-example-viewer.component';
import { ExampleHelpService } from './help.service';

/**
 * Provide a mock help service for the code example viewer so that examples
 * with help keys work properly. (StackBlitz pulls in its own version of the
 * help service; this is needed for this live demos on the docs site.)
 */
function provideExampleHelpService(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SkyHelpService, useClass: ExampleHelpService },
  ]);
}

/**
 * @internal
 */
@NgModule({
  imports: [SkyDocsCodeExampleViewerComponent],
  exports: [SkyDocsCodeExampleViewerComponent],
  providers: [provideExampleHelpService()],
})
export class SkyDocsCodeExampleViewerModule {}
