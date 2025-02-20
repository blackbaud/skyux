import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';

import { RouteListComponent } from './route-list.component';

describe('RouteListComponent', () => {
  let component: RouteListComponent;
  let fixture: ComponentFixture<RouteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouteListComponent],
      providers: [
        provideRouter([
          {
            loadChildren: (): Promise<Routes> => Promise.resolve([]),
            path: '',
          },
          {
            loadChildren: (): Promise<Routes> => Promise.resolve([]),
            path: 'test',
          },
          {
            loadChildren: (): Promise<Routes> => Promise.resolve([]),
            path: 'other',
          },
        ]),
      ],
    });

    fixture = TestBed.createComponent(RouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('h1')).nativeElement.textContent,
    ).toEqual('Route List');
    const list = fixture.debugElement.queryAll(By.css('li > a'));
    expect(list).toHaveSize(2);
    expect(new URL(list[1].properties['href']).pathname).toEqual('/test');
    expect(list[1].nativeElement.textContent).toEqual('test');
  });
});
