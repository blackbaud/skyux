import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyHrefModule, SkyHrefResolverService } from '@skyux/router';

import { MockResolverService } from './fixtures/mock-resolver-service';
import { SkyHrefDemoComponent } from './sky-href-demo.component';

describe('SkyHrefDemoComponent', () => {
  let component: SkyHrefDemoComponent;
  let fixture: ComponentFixture<SkyHrefDemoComponent>;
  let resolverService: MockResolverService;

  async function setup(userHasAccess: boolean): Promise<void> {
    resolverService = new MockResolverService(userHasAccess);

    TestBed.configureTestingModule({
      declarations: [SkyHrefDemoComponent],
      imports: [SkyHrefModule],
      providers: [
        {
          provide: SkyHrefResolverService,
          useValue: resolverService,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyHrefDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return fixture.whenStable().then();
  }

  it('should create', async () => {
    await setup(true);
    expect(component).toBeTruthy();
  });

  it('should show skyhref with access', async () => {
    await setup(true);
    expect(fixture.debugElement.query(By.css('#allow'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('#allow')).attributes['href']
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('#allow')).attributes['hidden']
    ).toBeFalsy();
  });

  it('should hide skyhref without access', async () => {
    await setup(false);
    expect(fixture.debugElement.query(By.css('#hidden'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('#hidden')).attributes['href']
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('#hidden')).attributes['hidden']
    ).toBeTruthy();
  });

  it('should unlink skyhref without access', async () => {
    await setup(false);
    expect(fixture.debugElement.query(By.css('#unlinked'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('#unlinked')).attributes['href']
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('#unlinked')).attributes['hidden']
    ).toBeFalsy();
  });
});
