import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ContactsPageContentComponent } from './contacts-page-content.component';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  standalone: true,
  imports: [CommonModule, SkyPageModule, ContactsPageContentComponent],
})
export default class ContactsPageComponent {}
