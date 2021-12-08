//#region imports

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyPageModule } from '../page.module';

import { SkyPageChildTestComponent } from './page-child.component.fixture';

import { SkyPageTestComponent } from './page.component.fixture';

//#endregion

@NgModule({
  declarations: [SkyPageChildTestComponent, SkyPageTestComponent],
  imports: [CommonModule, SkyPageModule],
  exports: [SkyPageChildTestComponent, SkyPageTestComponent],
})
export class SkyPageFixturesModule {}
