import { StacheOmnibarAdapterService, StacheWindowRef } from './index';

let classes: string[] = [];
let mockEnabled: boolean = false;

let mockElement: any = {
  classList: {
    add(cssClass: string) {
      classes.push(cssClass);
    }
  }
};

class MockWindowService {
  public nativeWindow: any = {
    document: {
      querySelector(selector: string) {
        if (mockEnabled) {
          return mockElement;
        }
        return undefined;
      }
    }
  };
}

describe('StacheOmnibarAdapterService', () => {
  const className = StacheOmnibarAdapterService['HAS_OMNIBAR_CLASS_NAME'];
  let omnibarService: StacheOmnibarAdapterService;
  let mockWindowService: MockWindowService;

  beforeEach(() => {
    mockEnabled = false;
    classes = [];
    mockWindowService = new MockWindowService();
  });

  it('should return 0 for the height of the omnibar if it does not exist', () => {
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(0);
  });

  it('should return the expected height of the omnibar if it does exist', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef
    );
    const testHeight = omnibarService.getHeight();
    expect(testHeight).toBe(StacheOmnibarAdapterService.EXPECTED_OMNIBAR_HEIGHT);
  });

  it('should add the class stache-omnibar-enabled to the body if omnibar exists', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef
    );
    expect(classes).toContain(className);
  });

  it('should return false if the omnibar does not exist', () => {
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef
    );
    expect(omnibarService.omnibarEnabled()).toBe(false);
  });

  it('should return true if the omnibar exists', () => {
    mockEnabled = true;
    omnibarService = new StacheOmnibarAdapterService(
      mockWindowService as StacheWindowRef
    );
    expect(omnibarService.omnibarEnabled()).toBe(true);
  });
});
