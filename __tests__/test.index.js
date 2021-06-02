import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';
const expected = '<!DOCTYPE html><html><head></head><body></body></html>';

let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('download html', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, expected);

  await pageLoader(url, tempDir);
  const files = await fs.readdir(tempDir);
  const result = await fs.readFile(path.join(tempDir, files[0]), 'utf-8');
  expect(result).toBe(expected);
});
