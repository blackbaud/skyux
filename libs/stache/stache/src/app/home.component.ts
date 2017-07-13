import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public actionButtonRoutes = [
    {
      name: 'Action Button 1',
      path: '/demos',
      icon: 'book',
      summary: 'Short summary here.'
    },
    {
      name: 'Action Button 2',
      path: 'mailto:brandon.hare@blackbaud.com',
      icon: 'bookmark',
      summary: 'Short summary here.'
    },
    {
      name: 'Action Button 3',
      path: 'http://facebook.com',
      icon: 'certificate',
      summary: 'Short summary here.'
    }
  ];
  public sidebarRoutes = [
    {
      name: 'Welcome Sidebar',
      path: '/',
      children: [
        {
          name: 'Sidebar Link is super long and even longer foo bar baz',
          path: '/0'
        },
        {
          name: 'Sidebar Link',
          path: '/1'
        },
        {
          name: 'Sidebar Link',
          path: '/2'
        },
        {
          name: 'Sidebar Link',
          path: '/3'
        },
        {
          name: 'Sidebar Link',
          path: '/4'
        },
        {
          name: 'Sidebar Link',
          path: '/5'
        },
        {
          name: 'Sidebar Link',
          path: '/6'
        },
        {
          name: 'Sidebar Link',
          path: '/7'
        },
        {
          name: 'Sidebar Link',
          path: '/8'
        },
        {
          name: 'Sidebar Link',
          path: '/9'
        },
        {
          name: 'Sidebar Link',
          path: '/1'
        },
        {
          name: 'Sidebar Link',
          path: '/2'
        },
        {
          name: 'Sidebar Link',
          path: '/3'
        },
        {
          name: 'Sidebar Link',
          path: '/4'
        },
        {
          name: 'Sidebar Link',
          path: '/5'
        },
        {
          name: 'Sidebar Link',
          path: '/6'
        },
        {
          name: 'Sidebar Link',
          path: '/7'
        },
        {
          name: 'Sidebar Link',
          path: '/8'
        },
        {
          name: 'Sidebar Link',
          path: '/9'
        },
        {
          name: 'Sidebar Link',
          path: '/1'
        },
        {
          name: 'Sidebar Link',
          path: '/2'
        },
        {
          name: 'Sidebar Link',
          path: '/3'
        },
        {
          name: 'Sidebar Link',
          path: '/4'
        },
        {
          name: 'Sidebar Link',
          path: '/5'
        },
        {
          name: 'Sidebar Link',
          path: '/6'
        },
        {
          name: 'Sidebar Link',
          path: '/7'
        },
        {
          name: 'Sidebar Link',
          path: '/8'
        },
        {
          name: 'Sidebar Link',
          path: '/9'
        },
        {
          name: 'Sidebar Link',
          path: '/1'
        },
        {
          name: 'Sidebar Link',
          path: '/2'
        },
        {
          name: 'Sidebar Link',
          path: '/3'
        },
        {
          name: 'Sidebar Link',
          path: '/4'
        },
        {
          name: 'Sidebar Link',
          path: '/5'
        },
        {
          name: 'Sidebar Link',
          path: '/6'
        },
        {
          name: 'Sidebar Link',
          path: '/7'
        },
        {
          name: 'Sidebar Link',
          path: '/8'
        },
        {
          name: 'Sidebar Link',
          path: '/9'
        }
      ]
    }
  ];
}
