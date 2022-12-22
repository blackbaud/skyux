import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHrefModule, SkyHrefResolverService } from '@skyux/router';

import { CustomSkyHrefResolverComponent } from './custom-resolver/custom-sky-href-resolver.component';
import { MockResolverService } from './fixtures/mock-resolver-service';
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
          useClass: MockResolverService,
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
