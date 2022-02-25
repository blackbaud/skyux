import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';

import { ListToolbarDemoComponent } from './list-toolbar-demo.component';

@NgModule({
  imports: [CommonModule, SkyListModule, SkyListToolbarModule],
  declarations: [ListToolbarDemoComponent],
  exports: [ListToolbarDemoComponent],
})
export class ListToolbarDemoModule {}
