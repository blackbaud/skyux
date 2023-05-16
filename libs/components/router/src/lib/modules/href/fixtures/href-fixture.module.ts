import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SkyHrefModule } from '../href.module';

import { HrefDirectiveFixtureComponent } from './href-fixture.component';

@NgModule({
  declarations: [HrefDirectiveFixtureComponent],
  imports: [
    CommonModule,
    HttpClientTestingModule,
    RouterTestingModule,
    SkyHrefModule,
  ],
})
export class HrefFixtureModule {}
