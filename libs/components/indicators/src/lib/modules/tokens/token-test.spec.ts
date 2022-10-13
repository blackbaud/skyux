import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';

@Component({
  selector: 'sky-token-test',
  templateUrl: './token-test.html',
})
class TokenTestComponent {
  public onChange(evt: KeyboardEvent): void {
    console.log(evt.key);
  }

  public onCloseButtonClick(): void {}
}

fdescribe('tokens', () => {
  it('should be accessible', async () => {
    TestBed.configureTestingModule({
      declarations: [TokenTestComponent],
    });

    const fixture = TestBed.createComponent(TokenTestComponent);

    const evt = new KeyboardEvent('change', { key: 'A' });

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
