import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public actionButtonRoutes = [
    {
      name: 'Internal link',
      path: '/demos',
      icon: 'link',
      summary: 'Link to our demo page.'
    },
    {
      name: 'Long summary',
      path: '/demos',
      icon: 'book',
      summary: 'A long summary here about lots of interesting things. How does this impact the layout?'
    },
    {
      name: 'External link',
      path: 'http://example.com',
      icon: 'link',
      summary: 'Click here to link to http://example.com.'
    },
    {
      name: 'Path with fragment',
      path: '/demos/tutorial/tutorial-one',
      fragment: 'clone-the-repository',
      icon: 'copy',
      summary: 'This should link to "clone-the-repository".'
    },
    {
      name: 'Another path with fragment',
      path: '/demos/tutorial/tutorial-one',
      fragment: 'include-columns-and-rows',
      icon: 'certificate',
      summary: 'This should link to "include-columns-and-rows".'
    },
    {
      name: 'Restricted Action Button 6',
      path: '/demos',
      icon: 'book',
      summary: 'This should only show if user is a authenticated BB user.',
      restricted: true
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
          name: 'Restricted Sidebar Link',
          path: '/1',
          restricted: true
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
}
