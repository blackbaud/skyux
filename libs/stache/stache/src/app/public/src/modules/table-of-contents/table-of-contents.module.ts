import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StacheNavModule } from '../nav';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';
import { StacheAffixModule } from '../affix';

@NgModule({
  declarations: [
    StacheTableOfContentsWrapperComponent,
    StacheTableOfContentsComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    SkyAppRuntimeModule,
    StacheAffixModule
  ],
  exports: [
    StacheTableOfContentsWrapperComponent,
    StacheTableOfContentsComponent
  ]
})
export class StacheTableOfContentsModule { }
