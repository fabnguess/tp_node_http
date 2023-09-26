// Import Node.js Dependencies
import { beforeEach, afterEach, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';
import path from 'node:path';

// Import Internal Dependencies
import { readPackageJson, listAndCheckDependencies } from '../index.js';

describe('readPackageJson', () => {
  let originalCwd;

  beforeEach(() => {
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  test('should throw an error if package.json is not found', () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    process.chdir(__dirname);

    const packageJsonPath = path.join(process.cwd(), 'package.json');

    assert.throws(() => readPackageJson(), {
      name: 'Error',
      message: `package.json not found at ${packageJsonPath}`,
    });
  });

  test('should read package.json', () => {
    const dependencies = readPackageJson();
    assert.ok(typeof dependencies === 'object');
  });
});
