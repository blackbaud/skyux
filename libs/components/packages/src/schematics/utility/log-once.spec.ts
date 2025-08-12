import { SchematicContext } from '@angular-devkit/schematics';

import { logOnce } from './log-once';

// Mock SchematicContext
function createMockContext() {
  return {
    logger: {
      log: jest.fn(),
    },
  } as unknown as SchematicContext;
}

describe('logOnce', () => {
  let context: SchematicContext;

  beforeEach(() => {
    context = createMockContext();
    // Reset the loggedMessages set by clearing the module cache
    jest.resetModules();
  });

  it('should log the message the first time', () => {
    logOnce(context, 'info', 'Test message');
    expect(context.logger.log).toHaveBeenCalledWith('info', 'Test message', {});
  });

  it('should not log the same message twice', () => {
    logOnce(context, 'info', 'Duplicate message');
    logOnce(context, 'info', 'Duplicate message');
    expect(context.logger.log).toHaveBeenCalledTimes(1);
  });

  it('should log different messages', () => {
    logOnce(context, 'info', 'Message 1');
    logOnce(context, 'info', 'Message 2');
    expect(context.logger.log).toHaveBeenCalledTimes(2);
  });

  it('should pass metadata to logger', () => {
    const metadata = { foo: 'bar' };
    logOnce(context, 'warn', 'Meta message', metadata);
    expect(context.logger.log).toHaveBeenCalledWith(
      'warn',
      'Meta message',
      metadata,
    );
  });
});
