import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  selector: 'app-buttons',
  imports: [NgTemplateOutlet, SkyButton, SkyFluidGridModule, SkyIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {}
