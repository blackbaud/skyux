import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-buttons',
  imports: [NgTemplateOutlet, SkyFluidGridModule, SkyIconModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {}
