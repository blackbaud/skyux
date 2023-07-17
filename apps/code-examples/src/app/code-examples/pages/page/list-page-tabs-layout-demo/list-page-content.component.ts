import { Component } from '@angular/core';
import { SkyTabIndex } from '@skyux/tabs';

@Component({
  selector: 'app-list-page-content',
  templateUrl: './list-page-content.component.html',
})
export class ListPageContentComponent {
  public activeTabIndex: SkyTabIndex = 0;

  public myContacts = [
    {
      name: 'Wonda Lumpkin',
      organization: 'Riverfront College of the Arts',
      emailAddress: 'wlumpkin@yahoo.com',
    },
    {
      name: 'Eliza Vanhorn',
      organization: 'Summit School of the Arts',
      emailAddress: 'evanhorn@outlook.com',
    },
    {
      name: 'Ed Sipes',
      organization: 'Reflections Middle School',
      emailAddress: 'esipes@yahoo.com',
    },
    {
      name: 'Elwood Farris',
      organization: 'Sandy Lagoon College',
      emailAddress: 'elfarris@gmail.com',
    },
    {
      name: 'Cristen Sizemore',
      organization: 'Grafton Vision Health',
      emailAddress: 'cristen.sizemore@aol.com',
    },
    {
      name: 'Latrice Ashmore',
      organization: 'Food Bank of Rapid City',
      emailAddress: 'lashmore@gmail.com',
    },
  ];

  public allContacts = [
    ...this.myContacts,
    {
      name: 'Kanesha Hutto',
      organization: 'Los Angeles College of the Arts',
      emailAddress: 'khutto@yahoo.com',
    },
    {
      name: 'Kristeen Lunsford',
      organization: 'Food Bank of Los Angeles',
      emailAddress: 'kristeen.lunsford@yahoo.com',
    },
    {
      name: 'Barbara Durr',
      organization: 'Riverfront Middle School',
      emailAddress: 'bdurr@gmail.com',
    },
    {
      name: 'Ilene Woo',
      organization: 'Rapid City High School',
      emailAddress: 'ilene.woo@aol.com',
    },
    {
      name: 'Darcel Lenz',
      organization: 'Riverfront College of the Arts',
      emailAddress: 'dlenz@yahoo.com',
    },
  ];
}
