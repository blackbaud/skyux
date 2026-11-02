import { Component } from '@angular/core';
import { SkyBlockquote, SkyBoxModule } from '@skyux/layout';
import { SkyPageModule } from '@skyux/pages';

@Component({
  imports: [SkyBlockquote, SkyBoxModule, SkyPageModule],
  selector: 'app-blockquote',
  templateUrl: './blockquote-playground.html',
})
export default class BlockquotePlayground {}
