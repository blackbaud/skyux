import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: false,
})
export class CardComponent {
  public cardOptions = [
    {
      size: 'large',
      title: 'Large selectable card with actions',
      selectable: true,
      selected: false,
      showActions: true,
      showContent: true,
    },
    {
      size: 'small',
      title: 'Small selectable card with actions',
      selectable: true,
      selected: false,
      showActions: true,
      showContent: true,
    },
    {
      size: 'large',
      title: 'Large selected card',
      selectable: true,
      selected: true,
      showActions: false,
      showContent: true,
    },
    {
      size: 'small',
      title: 'Small selected card',
      selectable: true,
      selected: true,
      showActions: false,
      showContent: true,
    },
    {
      size: 'large',
      title: 'Large card',
      selectable: false,
      showActions: false,
      showContent: true,
    },
    {
      size: 'small',
      title: 'Small card',
      selectable: false,
      showActions: false,
      showContent: true,
    },
    {
      size: 'large',
      title: 'Large card with no content',
      selectable: false,
      showActions: false,
      showContent: false,
    },
    {
      size: 'small',
      title: 'Small card with no content',
      selectable: false,
      showActions: false,
      showContent: false,
    },
    {
      size: 'large',
      selectable: false,
      showActions: false,
      showContent: true,
    },
    {
      size: 'small',
      selectable: false,
      showActions: false,
      showContent: true,
    },
  ];
}
