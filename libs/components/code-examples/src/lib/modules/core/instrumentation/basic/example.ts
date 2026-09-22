import { Component } from '@angular/core';
import {
  SkyInstrumentationContext,
  SkyInstrumentationTrackClick,
} from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Instrumentation context with basic setup
 */
@Component({
  imports: [
    SkyHelpInlineModule,
    SkyInstrumentationContext,
    SkyInstrumentationTrackClick,
  ],
  selector: 'app-core-instrumentation-basic-example',
  templateUrl: './example.html',
})
export class CoreInstrumentationBasicExample {}
