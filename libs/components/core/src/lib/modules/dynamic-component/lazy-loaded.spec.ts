import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { DynamicComponentTestComponent } from './fixtures/dynamic-component-test.component.fixture';

@Component({
  selector: 'sky-home-test',
  template: '<router-outlet></router-outlet>',
})
export class HomeTestComponent {}

fdescribe('Dynamic component service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: HomeTestComponent,
          },
          {
            path: 'lazy-loaded-test',
            loadChildren: () =>
              import('./fixtures/lazy-loaded-test.module').then(
                (m) => m.LazyLoadedTestModule
              ),
          },
        ]),
      ],
      declarations: [DynamicComponentTestComponent, HomeTestComponent],
    });
  });

  it('should use the element injector associated with the given parent injector', async () => {
    const fixture = TestBed.createComponent(HomeTestComponent);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    await router.navigate(['lazy-loaded-test']);

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    // Create the dynamic component.
    const btn = document.querySelector('button.click-me') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();

    expect(
      (document.body.lastChild as HTMLElement).querySelector('.component-test')
    ).toHaveText('I am lazy.'); // <-- provided by the lazy-loaded module
  });
});
