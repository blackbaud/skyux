import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyAvatarModule } from '@skyux/avatar';

import { SkyAvatarFixture } from './avatar-fixture';

//#region Test component
@Component({
  selector: 'sky-avatar-test',
  template: `
    <sky-avatar
      [name]="name()"
      [src]="src()"
      [canChange]="true"
      (avatarChanged)="(avatarChanged)"
      data-sky-id="test-avatar"
    >
    </sky-avatar>
  `,
  standalone: false,
})
class TestComponent {
  public name = input<string | undefined>(undefined);

  public src = input<string | undefined>(undefined);

  public canChange = false;

  public avatarChanged(): void {
    return;
  }
}
//#endregion Test component

describe('Avatar fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyAvatarModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.componentRef.setInput('name', 'Robert Hernandez');
    fixture.detectChanges();

    const avatar = new SkyAvatarFixture(fixture, 'test-avatar');

    expect(avatar.initials).toBe('RH');
    expect(avatar.imageUrl).toBeUndefined();

    fixture.componentRef.setInput('src', 'https://example.com/img/');
    fixture.detectChanges();

    expect(avatar.initials).toBeUndefined();
    expect(avatar.imageUrl).toBe('https://example.com/img/');
  });
});
