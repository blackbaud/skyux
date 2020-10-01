import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyAppResourcesService,
  SkyI18nModule
} from '@skyux/i18n';

import {
  EMPTY,
  of as observableOf
} from 'rxjs';

import {
  SkyA11yAnalyzerConfig
} from '../a11y/a11y-analyzer-config';

import {
  expect,
  expectAsync
} from './matchers';

function createElement(innerText: string): any {
  const elem = document.createElement('div');
  const textNode = document.createTextNode(innerText);

  elem.appendChild(textNode);
  document.body.appendChild(elem);

  return elem;
}

function createPassingElement(): any {
  const wrapper = document.createElement('div');
  const elem1 = document.createElement('div');
  const elem2 = document.createElement('div');
  wrapper.appendChild(elem1);
  wrapper.appendChild(elem2);
  document.body.appendChild(wrapper);
  return wrapper;
}

function createFailingElement(): any {
  // Make every DIV have the same ID:
  const element = createPassingElement();
  [].slice.call(element.querySelectorAll('div')).forEach((elem: any) => {
    elem.setAttribute('id', 'same-id');
  });
  return element;
}

describe('Jasmine matchers', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyI18nModule],
      providers: [SkyAppResourcesService]
    });
    document.body.innerHTML = '';
  });

  it('should check element visibility', () => {
    const elem = document.createElement('div');
    document.body.appendChild(elem);
    expect(elem).toBeVisible();

    elem.style.display = 'none';
    expect(elem).not.toBeVisible();
  });

  it('should check element inner text', () => {
    const elem = document.createElement('div');
    const textNode = document.createTextNode(' foo bar baz  ');
    elem.appendChild(textNode);
    document.body.appendChild(elem);
    expect(elem).toHaveText('foo bar baz');
    expect(elem).not.toHaveText(' foo bar baz  ');
    expect(elem).toHaveText(' foo bar baz  ', false);
  });

  it('should check element for specific class name', () => {
    const elem = document.createElement('div');
    elem.className = 'foo bar baz';
    document.body.appendChild(elem);
    expect(elem).toHaveCssClass('bar');
    expect(elem).not.toHaveCssClass('other');
    try {
      expect(elem).toHaveCssClass('.with-dot');
    } catch (err) {
      expect(err.message).toEqual('Please remove the leading dot from your class name.');
    }
  });

  it('should check element for specific styles', () => {
    const elem = document.createElement('div');
    elem.style.fontSize = '10px';
    elem.style.top = '0px';
    document.body.appendChild(elem);

    // One success
    expect(elem).toHaveStyle({
      'font-size': '10px'
    });

    // Two successes
    expect(elem).toHaveStyle({
      'font-size': '10px',
      'top': '0px'
    });

    // One failure
    expect(elem).not.toHaveStyle({
      'font-family': 'sans-serif'
    });

    // Two failures
    expect(elem).not.toHaveStyle({
      'font-family': 'sans-serif',
      'font-size': '12px'
    });
  });

  it('should check if element exists', () => {
    const elem = document.createElement('div');
    expect(elem).toExist();
    const found = document.querySelector('.nonexistent-div');
    expect(found).not.toExist();
  });

  describe('toBeAccessible', () => {

    it('should check accessibility', async(() => {
      const element = createPassingElement();
      expect(element).toBeAccessible();
    }));

    it('should fail if accessibility rules fail', async(() => {
      const failSpy = spyOn((window as any), 'fail').and.callFake((message: string) => {
        expect(message.indexOf('duplicate-id') > -1).toEqual(true);
      });

      const element = createFailingElement();

      // This will result in a failure on a consumer unit test.
      // We're swallowing the error in order to double-check
      // that an accessibility error was indeed logged.
      expect(element).toBeAccessible(() => {
        expect(failSpy).toHaveBeenCalled();
      });
    }));

    describe('configuration', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            {
              provide: SkyAppConfig,
              useValue: {
                skyux: {
                  a11y: {}
                }
              }
            }
          ]
        });
      });

      it('should allow configuration override', async(() => {
        const element = createFailingElement();
        expect(element).toBeAccessible(() => {}, {
          rules: {
            'duplicate-id': { enabled: false }
          }
        });
      }));

      it('should allow SkyAppConfig override', async(
        inject([SkyAppConfig], (config: SkyAppConfig) => {
          const element = createPassingElement();
          expect(element).toBeAccessible(() => {}, config.skyux.a11y as SkyA11yAnalyzerConfig);
        }))
      );
    });
  });

  describe('toEqualResourceText', () => {
    let resourcesService: SkyAppResourcesService;

    beforeEach(() => {
      resourcesService = TestBed.inject(SkyAppResourcesService);
    });

    it('should check that the actual text matches text provided by resources', async(() => {
      const messageKey = 'name';
      const messageValue = 'message from resource';
      const text = 'message from resource';

      spyOn(resourcesService, 'getString').and.callFake((name: string) => {
        if (name === messageKey) {
          return observableOf(messageValue);
        } else {
          return EMPTY;
        }
      });

      expect(text).toEqualResourceText(messageKey);
    }));

    it('should check that the actual text matches text provided by resources with arguments', async(() => {
      const messageKey = 'nameWithArgs';
      const messageValue = 'message from resources with args = {0}';
      const messageArgs: any[] = [100];
      const text = 'message from resources with args = 100';

      spyOn(resourcesService, 'getString').and.callFake((name: string, args: any[]) => {
        if (name === messageKey) {
          return observableOf(messageValue.replace('{0}', args[0]));
        } else {
          return EMPTY;
        }
      });

      expect(text).toEqualResourceText(messageKey, messageArgs, () => {});
    }));

    it('should fail if the actual text does not match text provided by resources', (done) => {
      const messageKey = 'nameThatDoesNotExist';
      const messageValue = 'message from resource';
      const text = 'Some text that\'s not in the resources';

      const failSpy = spyOn((window as any), 'fail').and.callFake((message: string) => {
        expect(message).toEqual(`Expected "${text}" to equal "${messageValue}"`);
      });

      spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

      // This will result in a failure on a consumer unit test.
      // We're swallowing the error in order to double-check
      // that the text did not match the resource message
      expect(text).toEqualResourceText(messageKey, undefined, () => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('toHaveResourceText', () => {
    let resourcesService: SkyAppResourcesService;

    beforeEach(() => {
      resourcesService = TestBed.inject(SkyAppResourcesService);
    });

    it('should check that the element\'s text matches text provided by resources', async(() => {
      const messageKey = 'name';
      const messageValue: string = 'message from resource';
      const elem = createElement(messageValue);

      spyOn(resourcesService, 'getString').and.callFake((name: string) => {
        if (name === messageKey) {
          return observableOf(messageValue);
        } else {
          return EMPTY;
        }
      });

      expect(elem).toHaveResourceText(messageKey);
    }));

    it('should default to trimming whitespace and check that the element\'s text matches text provided by resources', async(() => {
      const messageKey = 'name';
      const messageValue: string = 'message from resource';
      const elem: any = createElement(`    ${messageValue}     `);

      spyOn(resourcesService, 'getString').and.callFake((name: string) => {
        if (name === messageKey) {
          return observableOf(messageValue);
        } else {
          return EMPTY;
        }
      });

      expect(elem).toHaveResourceText(messageKey);
    }));

    it('should check that the element\'s text matches text provided by resources with arguments', async(() => {
      const messageKey = 'nameWithArgs';
      const messageValue = 'message from resources with args = {0}';
      const messageArgs: any[] = [100];
      const elem = createElement(messageValue.replace('{0}', messageArgs[0]));

      spyOn(resourcesService, 'getString').and.callFake((name: string, args: any[]) => {
        if (name === messageKey) {
          return observableOf(messageValue.replace('{0}', args[0]));
        } else {
          return EMPTY;
        }
      });

      expect(elem).toHaveResourceText(messageKey, messageArgs);
    }));

    it('should fail if the element\'s text does not match text provided by resources', (done) => {
      const messageKey = 'nameThatDoesNotExist';
      const messageValue = 'message from resource';
      const elem = createElement('Some text that\'s not in the resources');

      const failSpy = spyOn((window as any), 'fail').and.callFake((message: string) => {
        expect(message).toEqual(`Expected element's inner text to be "${messageValue}"`);
      });

      spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

      // This will result in a failure on a consumer unit test.
      // We're swallowing the error in order to double-check
      // that the text did not match the resource message
      expect(elem).toHaveResourceText(messageKey, undefined, true, () => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should fail if whitespace is not trimmed and the element\'s text does not match text provided by resources', (done) => {
      const messageKey = 'name';
      const messageValue = 'message from resource';
      const elem = createElement(`    ${messageValue}    `);

      const failSpy = spyOn((window as any), 'fail').and.callFake((message: string) => {
        expect(message).toEqual(`Expected element's inner text to be "${messageValue}"`);
      });

      spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

      // This will result in a failure on a consumer unit test.
      // We're swallowing the error in order to double-check
      // that the text did not match the resource message
      expect(elem).toHaveResourceText(messageKey, [], false, () => {
        expect(failSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('expectAsync', () => {

    describe('toBeAccessible', () => {
      it('should check accessibility', async () => {
        const element = createPassingElement();
        await expectAsync(element).toBeAccessible();
      });

      it('should support the .not. operator', async () => {
        const element = createFailingElement();
        await expectAsync(element).not.toBeAccessible();
      });
    });

    describe('toEqualResourceText', () => {
      let resourcesService: SkyAppResourcesService;

      beforeEach(() => {
        resourcesService = TestBed.inject(SkyAppResourcesService);
      });

      it('should check that the actual text matches text provided by resources', async () => {
        const messageKey = 'name';
        const messageValue = 'message from resource';
        const text = 'message from resource';

        spyOn(resourcesService, 'getString').and.callFake((name: string) => {
          if (name === messageKey) {
            return observableOf(messageValue);
          } else {
            return EMPTY;
          }
        });

        await expectAsync(text).toEqualResourceText(messageKey);
      });

      it('should check that the actual text matches text provided by resources with arguments', async () => {
        const messageKey = 'nameWithArgs';
        const messageValue = 'message from resources with args = {0}';
        const messageArgs: any[] = [100];
        const text = 'message from resources with args = 100';

        spyOn(resourcesService, 'getString').and.callFake((name: string, args: any[]) => {
          if (name === messageKey) {
            return observableOf(messageValue.replace('{0}', args[0]));
          } else {
            return EMPTY;
          }
        });

        await expectAsync(text).toEqualResourceText(messageKey, messageArgs);
      });

      it('should fail if the actual text does not match text provided by resources', async () => {
        const messageKey = 'nameThatDoesNotExist';
        const messageValue = 'message from resource';
        const text = 'Some text that\'s not in the resources';

        spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

        await expectAsync(text).not.toEqualResourceText(messageKey, undefined);
      });
    });

    describe('toHaveResourceText', () => {
      let resourcesService: SkyAppResourcesService;

      beforeEach(() => {
        resourcesService = TestBed.inject(SkyAppResourcesService);
      });

      it('should check that the element\'s text matches text provided by resources', async () => {
        const messageKey = 'name';
        const messageValue: string = 'message from resource';
        const elem = createElement(messageValue);

        spyOn(resourcesService, 'getString').and.callFake((name: string) => {
          if (name === messageKey) {
            return observableOf(messageValue);
          } else {
            return EMPTY;
          }
        });

        await expectAsync(elem).toHaveResourceText(messageKey);
      });

      it('should default to trimming whitespace and check that the element\'s text matches text provided by resources', async () => {
        const messageKey = 'name';
        const messageValue: string = 'message from resource';
        const elem: any = createElement(`    ${messageValue}     `);

        spyOn(resourcesService, 'getString').and.callFake((name: string) => {
          if (name === messageKey) {
            return observableOf(messageValue);
          } else {
            return EMPTY;
          }
        });

        await expectAsync(elem).toHaveResourceText(messageKey);
      });

      it('should check that the element\'s text matches text provided by resources with arguments', async () => {
        const messageKey = 'nameWithArgs';
        const messageValue = 'message from resources with args = {0}';
        const messageArgs: any[] = [100];
        const elem = createElement(messageValue.replace('{0}', messageArgs[0]));

        spyOn(resourcesService, 'getString').and.callFake((name: string, args: any[]) => {
          if (name === messageKey) {
            return observableOf(messageValue.replace('{0}', args[0]));
          } else {
            return EMPTY;
          }
        });

        await expectAsync(elem).toHaveResourceText(messageKey, messageArgs);
      });

      it('should fail if the element\'s text does not match text provided by resources', async () => {
        const messageKey = 'nameThatDoesNotExist';
        const messageValue = 'message from resource';
        const elem = createElement('Some text that\'s not in the resources');

        spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

        await expectAsync(elem).not.toHaveResourceText(messageKey);
      });

      it('should fail if whitespace is not trimmed and the element\'s text does not match text provided by resources', async () => {
        const messageKey = 'name';
        const messageValue = 'message from resource';
        const elem = createElement(`    ${messageValue}    `);

        spyOn(resourcesService, 'getString').and.returnValue(observableOf(messageValue));

        await expectAsync(elem).not.toHaveResourceText(messageKey, [], false);
      });
    });
  });
});
