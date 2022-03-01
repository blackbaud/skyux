import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkySectionedFormModule } from '../sectioned-form.module';

import { SkySectionedFormFixtureInformation1Component } from './sectioned-form-fixture-information-1.component';
import { SkySectionedFormFixtureInformation2Component } from './sectioned-form-fixture-information-2.component';
import { SkySectionedFormNoActiveFixtureComponent } from './sectioned-form-no-active.component.fixture';
import { SkySectionedFormNoSectionsFixtureComponent } from './sectioned-form-no-sections.component.fixture';
import { SkySectionedFormFixtureComponent } from './sectioned-form.component.fixture';

@NgModule({
  declarations: [
    SkySectionedFormFixtureComponent,
    SkySectionedFormFixtureInformation1Component,
    SkySectionedFormFixtureInformation2Component,
    SkySectionedFormNoSectionsFixtureComponent,
    SkySectionedFormNoActiveFixtureComponent,
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkySectionedFormModule,
    SkyCheckboxModule,
    FormsModule,
  ],
  exports: [
    SkySectionedFormFixtureComponent,
    SkySectionedFormFixtureInformation1Component,
    SkySectionedFormFixtureInformation2Component,
    SkySectionedFormNoSectionsFixtureComponent,
    SkySectionedFormNoActiveFixtureComponent,
  ],
})
export class SkySectionedFormFixturesModule {}
