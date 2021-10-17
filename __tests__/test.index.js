import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';

nock.disableNetConnect();

const getFixturePath = (name) => path.join(process.cwd(), '__tests__', '__fixtures__', name);

const fixtures = {
  base: 'https://ru.hexlet.io/',
  html: {
    url: 'https://ru.hexlet.io/courses',
    path: '/courses',
    name: 'before.html',
  },
};

let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('download html', async () => {
  const expected = await fs.readFile(getFixturePath(fixtures.html.name), 'utf-8');

  nock(fixtures.base)
    .get(fixtures.html.path)
    .reply(200, expected);

  await pageLoader(fixtures.html.url, tempDir);

  const files = await fs.readdir(tempDir);
  const result = await fs.readFile(path.join(tempDir, files[0]), 'utf-8');
  expect(result).toBe(expected);
});
