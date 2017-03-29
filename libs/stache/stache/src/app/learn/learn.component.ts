import { Component } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html'
})
export class LearnComponent {
  public sidebarRoutes: any[] = [
    { name: 'Overview', path: '/learn' },
    { name: 'Tutorials', path: '/learn/tutorials' },
    { name: 'Technical Reference', path: '/learn/reference' },
    { name: 'Resources', path: '/learn/resources' },
    { name: 'FAQ', path: '/learn/faq' }
  ];

  public breadcrumbsRoutes: any[] = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' }
  ];
}
