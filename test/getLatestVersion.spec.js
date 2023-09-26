// Import Node.js Dependencies
import { beforeEach, afterEach, describe, test } from 'node:test';
import assert from 'node:assert';

// Import Third-party Dependencies
import { MockAgent } from 'undici';

// Import Internal Dependencies
import { getLatestVersion } from '../index.js';

const agent = new MockAgent();
agent.disableNetConnect();

describe('getLatestVersion', () => {
  let client;
  beforeEach(() => {
    client = agent.get('https://registry.npmjs.org/');
  });

  test('should return the latest versions of all dependencies', async () => {
    const dependencies = {
      '@nodesecure/ossf-scorecard-sdk': '^3.0.0',
      '@nodesecure/i18n': '^3.3.0',
    };

    const expectedVersions = [
      { packageName: '@nodesecure/ossf-scorecard-sdk', latestVersion: '3.0.0' },
      { packageName: '@nodesecure/i18n', latestVersion: '3.3.0' },
    ];

    client
      .intercept({
        method: 'GET',
        path: (url) => url.startsWith('https://registry.npmjs.org/'),
      })
      .reply(
        200,
        JSON.stringify({
          'dist-tags': {
            latest: expectedVersions[0].latestVersion,
          },
        })
      );

    const actualVersions = await getLatestVersion(dependencies);

    assert.deepEqual(actualVersions, expectedVersions);
  });
});
