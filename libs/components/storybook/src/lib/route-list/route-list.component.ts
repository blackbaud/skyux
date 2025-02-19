import { Component, inject } from '@angular/core';
import { ROUTES, Route, RouterLink } from '@angular/router';

type RouteWithPath = Route & Required<Pick<Route, 'path'>>;

/**
 * @internal
 */
@Component({
  selector: 'sky-route-list',
  imports: [RouterLink],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css',
})
export class RouteListComponent {
  protected routes = inject(ROUTES)
    .flat()
    .filter((route): route is RouteWithPath => !!route.path)
    .sort((a, b) => a.path.localeCompare(b.path));
}
