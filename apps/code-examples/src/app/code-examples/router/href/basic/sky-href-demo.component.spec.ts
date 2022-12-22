import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHref,
  SkyHrefModule,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { CustomSkyHrefResolverComponent } from './custom-resolver/custom-sky-href-resolver.component';
import { SkyHrefDemoComponent } from './sky-href-demo.component';

describe('SkyHrefDemoComponent', () => {
  let component: SkyHrefDemoComponent;
  let fixture: ComponentFixture<SkyHrefDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyHrefDemoComponent, CustomSkyHrefResolverComponent],
      imports: [SkyHrefModule],
      providers: [
        {
          provide: SkyHrefResolverService,
          useValue: {
            resolveHref: ({ url }: SkyHrefResolverArgs): Promise<SkyHref> =>
              Promise.resolve({ url, userHasAccess: true }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SkyHrefDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
