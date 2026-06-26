import { Component } from '@angular/core';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
  styleUrls: ['./description-list.component.scss'],
  standalone: false,
})
export class DescriptionListComponent {
  public orgInfo: { label: string; value?: string }[] = [
    {
      label: 'Blackbaud, Inc.',
      value:
        'At Blackbaud, our vision is to power an Ecosystem of Good® that builds a better world. One where everyone has meaningful opportunities to drive impact. One where we achieve more together than we can apart. One where good can take over.',
    },
    {
      label: 'EVERFI',
    },
    {
      label: 'JustGiving',
      value:
        'Raise more money, change more lives. Supporter behavior is undergoing a radical shift. JustGiving offers a standalone or integrated online fundraising platform. With beautifully branded campaigns that include peer-to-peer fundraising and direct giving, the simple to use interface matched with Blackbaud’s expertise levels the playing field for small to medium-sized nonprofits, improving donor acquisition and increasing donation conversion rates.',
    },
  ];

  public personalInfo: {
    label: string;
    value?: string;
    helpContent?: string;
  }[] = [
    {
      label: 'College',
      value: 'Humanities and Social Sciences',
      helpContent: 'The college in which the student is enrolled.',
    },
    {
      label: 'Department',
      value: 'Geography',
    },
    {
      label: 'Advisor',
      helpContent: 'The faculty member who advises the student.',
    },
    {
      label: 'Class Year',
      value: '2024',
      helpContent: 'The year in which the student is expected to graduate.',
    },
  ];
}
