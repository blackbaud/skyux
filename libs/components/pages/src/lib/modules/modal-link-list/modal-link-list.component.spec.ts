import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { SkyModalService } from '@skyux/modals';
import { SkyHrefTestingModule } from '@skyux/router/testing';

import { SkyModalLinkListComponent } from './modal-link-list.component';
import { SkyModalLinkListModule } from './modal-link-list.module';

@Component({
  template: '',
  standalone: false,
})
class MockComponent {}

@Component({
  standalone: true,
  template: '',
})
class MockStandaloneComponent {}

describe('SkyModalLinkListComponent', () => {
  let component: SkyModalLinkListComponent;
  let fixture: ComponentFixture<SkyModalLinkListComponent>;
  let openModalSpy: jasmine.Spy;

  beforeEach(() => {
    openModalSpy = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [
        SkyModalLinkListModule,
        MockStandaloneComponent,
        SkyHrefTestingModule.with({ userHasAccess: true }),
      ],
      providers: [
        {
          provide: SkyModalService,
          useValue: {
            open: openModalSpy,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(SkyModalLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('links', [
      {
        label: 'Link 1',
        modal: { component: MockStandaloneComponent, config: {} },
      },
      {
        label: 'Link 2',
        permalink: {
          url: 'http://example.com',
        },
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const link = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button.sky-link-list-item'),
    );
    expect(link.length).toBe(1);
    SkyAppTestUtility.fireDomEvent(link[0], 'click');
    expect(openModalSpy).toHaveBeenCalledWith(MockStandaloneComponent, {});
  });

  it('should log when modal is not standalone', async () => {
    const logger = TestBed.inject(SkyLogService);
    spyOn(logger, 'deprecated');
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('links', [
      {
        label: 'Link 1',
        modal: { component: MockComponent, config: {} },
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const link = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button.sky-link-list-item'),
    );
    expect(link.length).toBe(1);
    SkyAppTestUtility.fireDomEvent(link[0], 'click');
    expect(logger.deprecated).toHaveBeenCalled();
    expect(openModalSpy).toHaveBeenCalledWith(MockComponent, {});
  });

  it('should handle empty input', async () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('links', undefined);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.links()).toBeUndefined();
    expect(fixture.nativeElement.querySelector('ul.sky-link-list')).toBeFalsy();
  });
});
