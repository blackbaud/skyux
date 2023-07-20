/* eslint-disable @cspell/spellchecker */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkyTabIndex } from '@skyux/tabs';
import { SkyTabsModule } from '@skyux/tabs';

import { ContactsGridComponent } from './contacts-grid.component';

@Component({
  selector: 'app-contact-page-content',
  templateUrl: './contacts-page-content.component.html',
  standalone: true,
  imports: [CommonModule, SkyTabsModule, ContactsGridComponent],
})
export class ContactsPageContentComponent {
  public activeTabIndex: SkyTabIndex = 0;

  public myContacts = [
    {
      id: '1',
      name: 'Wonda Lumpkin',
      organization: 'Riverfront College of the Arts',
      emailAddress: 'wlumpkin@yahoo.com',
      selected: false,
    },
    {
      id: '2',
      name: 'Eliza Vanhorn',
      organization: 'Summit School of the Arts',
      emailAddress: 'evanhorn@outlook.com',
      selected: false,
    },
    {
      id: '3',
      name: 'Ed Sipes',
      organization: 'Reflections Middle School',
      emailAddress: 'esipes@yahoo.com',
      selected: false,
    },
    {
      id: '4',
      name: 'Elwood Farris',
      organization: 'Sandy Lagoon College',
      emailAddress: 'elfarris@gmail.com',
      selected: false,
    },
    {
      id: '5',
      name: 'Cristen Sizemore',
      organization: 'Grafton Vision Health',
      emailAddress: 'cristen.sizemore@aol.com',
      selected: false,
    },
    {
      id: '6',
      name: 'Latrice Ashmore',
      organization: 'Food Bank of Rapid City',
      emailAddress: 'lashmore@gmail.com',
      selected: false,
    },
  ];

  public allContacts = [
    ...this.myContacts,
    {
      id: '7',
      name: 'Kanesha Hutto',
      organization: 'Los Angeles College of the Arts',
      emailAddress: 'khutto@yahoo.com',
      selected: false,
    },
    {
      id: '8',
      name: 'Kristeen Lunsford',
      organization: 'Food Bank of Los Angeles',
      emailAddress: 'kristeen.lunsford@yahoo.com',
      selected: false,
    },
    {
      id: '9',
      name: 'Barbara Durr',
      organization: 'Riverfront Middle School',
      emailAddress: 'bdurr@gmail.com',
      selected: false,
    },
    {
      id: '10',
      name: 'Ilene Woo',
      organization: 'Rapid City High School',
      emailAddress: 'ilene.woo@aol.com',
      selected: false,
    },
    {
      id: '11',
      name: 'Darcel Lenz',
      organization: 'Riverfront College of the Arts',
      emailAddress: 'dlenz@yahoo.com',
      selected: false,
    },
  ];
}
