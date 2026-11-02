import { Component } from '@angular/core';
import { SkyCode } from '@skyux/code';
import { SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBoxModule, SkyCode, SkyPageModule],
  selector: 'app-code',
  templateUrl: './code-playground.html',
})
export default class CodePlayground {}
