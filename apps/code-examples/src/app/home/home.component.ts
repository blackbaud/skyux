import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getDocumentationGroup } from '@skyux/manifest';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  protected data = getDocumentationGroup('@skyux/indicators', 'alert');
}
