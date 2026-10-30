import { Component } from '@angular/core';
import { SkyCodeComponent } from '@skyux/code';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBoxModule, SkyCodeComponent, SkyPageModule],
  selector: 'app-code',
  templateUrl: './code-playground.html',
})
export default class CodePlayground {}
