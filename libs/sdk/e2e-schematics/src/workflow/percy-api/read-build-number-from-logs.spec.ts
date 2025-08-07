import { readPercyBuildNumberFromLogString } from './read-build-number-from-logs';

describe('read-build-number-from-logs', () => {
  describe('readPercyBuildNumberFromLogString', () => {
    it('should extract the buildId when the log contains a finalized build line', () => {
      const log = `
Some unrelated log output
Checking for finalized build: [percy] Finalized build #6134: https://percy.io/82a32315/web/skyux-integration-e2e/builds/41420284
More unrelated log output
`;
      expect(readPercyBuildNumberFromLogString(log)).toBe('41420284');
    });

    it('should return undefined when the log does not contain a finalized build line', () => {
      const log = `
Some unrelated log output
No finalized build here
More unrelated log output
`;
      expect(readPercyBuildNumberFromLogString(log)).toBeUndefined();
    });
  });

  describe('readPercyBuildNumberFromLogFile', () => {
    const mockLog = `
Some unrelated log output
Checking for finalized build: [percy] Finalized build #6134: https://percy.io/82a32315/web/skyux-integration-e2e/builds/41420284
More unrelated log output
`;

    beforeEach(() => {
      jest.resetModules();
    });

    it('should extract the buildId from a log file', () => {
      jest.mock('node:fs', () => ({
        readFileSync: jest.fn(() => mockLog),
      }));
      // Re-import after mocking
      const {
        readPercyBuildNumberFromLogFile,
      } = require('./read-build-number-from-logs');
      expect(readPercyBuildNumberFromLogFile('fake/path/to/log.txt')).toBe(
        '41420284',
      );
    });

    it('should handle an error', () => {
      jest.mock('node:fs', () => ({
        readFileSync: jest.fn(() => {
          throw new Error('File not found');
        }),
      }));
      // Re-import after mocking
      const {
        readPercyBuildNumberFromLogFile,
      } = require('./read-build-number-from-logs');
      expect(
        readPercyBuildNumberFromLogFile('fake/path/to/log.txt'),
      ).toBeUndefined();
    });
  });
});
