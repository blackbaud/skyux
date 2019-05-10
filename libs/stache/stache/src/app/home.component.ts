import {
  Component
} from '@angular/core';

import {
  StacheNavLink
} from './public';

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
      path: 'http://google.com',
      icon: 'certificate',
      summary: 'Short summary here.'
    },
    {
      name: 'Action Button 4',
      path: '/demos/tutorial/tutorial-one',
      fragment: 'clone-the-repository',
      icon: 'certificate',
      summary: 'Short summary here.'
    },
    {
      name: 'Action Button 5',
      path: '/demos/tutorial/tutorial-one',
      fragment: 'does-not-exist',
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
          name: 'Last Item',
          path: '/9'
        }
      ]
    }
  ];

  public inPageRoutes: StacheNavLink[] = [
    {
      name: 'test',
      path: '/',
      offsetTop: 200
    },
    {
      name: 'test2',
      path: '/',
      offsetTop: 500
    }
  ];
}
