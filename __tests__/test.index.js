import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';

nock.disableNetConnect();

const getFixturePath = (name) => path.join(process.cwd(), '__tests__', '__fixtures__', name);

const fixtures = {
  base: 'https://ru.hexlet.io/',
  dir: 'ru-hexlet-io-courses_files',
  html: {
    url: 'https://ru.hexlet.io/courses',
    path: '/courses',
    before: 'before.html',
    after: 'after.html'
  },
  img: {
    path: '/assets/professions/nodejs.png',
    name: 'ru-hexlet-io-assets-professions-nodejs.png',
    expected: 'nodejs.png'
  }
};

let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('download html', async () => {
  const rawHtml = await fs.readFile(getFixturePath(fixtures.html.before), 'utf-8');
  const expectedHtml = await fs.readFile(getFixturePath(fixtures.html.after), 'utf-8');
  const expectedImg = await fs.readFile(getFixturePath(fixtures.img.expected), 'utf-8');

  nock(fixtures.base)
    .get(fixtures.html.path)
    .reply(200, rawHtml)
    .get(fixtures.img.path)
    .reply(200, expectedImg);

  await pageLoader(fixtures.html.url, tempDir);

  const files = await fs.readdir(tempDir);
  const resultHtml = await fs.readFile(path.join(tempDir, files[0]), 'utf-8');
  const dirStats = await fs.stat(path.join(tempDir, fixtures.dir));
  const imgStats = await fs.stat(path.join(tempDir, fixtures.dir, fixtures.img.name));

  expect(resultHtml).toBe(expectedHtml);
  expect(dirStats.isDirectory()).toBeTruthy();
  expect(imgStats.isFile()).toBeTruthy();
});
