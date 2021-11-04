import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import pageLoader from '../index.js';

nock.disableNetConnect();

const getFixturePath = (name) => path.join(process.cwd(), '__fixtures__', name);

const fixtures = {
  base: 'https://ru.hexlet.io/',
  dir: 'ru-hexlet-io-courses_files',
  html: {
    url: 'https://ru.hexlet.io/courses',
    path: '/courses',
    before: 'before.html',
    after: 'after.html',
  },
  img: {
    path: '/assets/professions/nodejs.png',
    name: 'ru-hexlet-io-assets-professions-nodejs.png',
    expected: 'nodejs.png',
  },
  link: {
    path: [
      '/assets/application.css',
      '/courses',
    ],
    name: [
      'ru-hexlet-io-assets-application.css',
      'ru-hexlet-io-courses.html',
    ],
    expected: [
      'application.css',
      'ru-hexlet-io-courses.html',
    ],
  },
  script: {
    path: '/packs/js/runtime.js',
    name: 'ru-hexlet-io-packs-js-runtime.js',
    expected: 'runtime.js',
  },
};

let tempDir;
let rawHtml;
let expectedHtml;
let expectedImg;
let expectedLink1;
let expectedLink2;
let expectedScript;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  rawHtml = await fs.readFile(getFixturePath(fixtures.html.before), 'utf-8');
  expectedHtml = await fs.readFile(getFixturePath(fixtures.html.after), 'utf-8');
  expectedImg = await fs.readFile(getFixturePath(fixtures.img.expected), 'utf-8');
  expectedLink1 = await fs.readFile(getFixturePath(fixtures.link.expected[0]), 'utf-8');
  expectedLink2 = await fs.readFile(getFixturePath(fixtures.link.expected[1]), 'utf-8');
  expectedScript = await fs.readFile(getFixturePath(fixtures.script.expected), 'utf-8');
});

describe('positive cases', () => {
  test('successful execution', async () => {
    nock(fixtures.base)
      .get(fixtures.html.path)
      .reply(200, rawHtml)
      .get(fixtures.img.path)
      .reply(200, expectedImg)
      .get(fixtures.link.path[0])
      .reply(200, expectedLink1)
      .get(fixtures.link.path[1])
      .reply(200, expectedLink2)
      .get(fixtures.script.path)
      .reply(200, expectedScript);

    await pageLoader(fixtures.html.url, tempDir);

    const files = await fs.readdir(tempDir);
    const resultHtml = await fs.readFile(path.join(tempDir, files[0]), 'utf-8');
    const dirStats = await fs.stat(path.join(tempDir, fixtures.dir));
    const imgStats = await fs.stat(path.join(tempDir, fixtures.dir, fixtures.img.name));
    const linkStats1 = await fs.stat(path.join(tempDir, fixtures.dir, fixtures.link.name[0]));
    const linkStats2 = await fs.stat(path.join(tempDir, fixtures.dir, fixtures.link.name[1]));
    const scriptStats = await fs.stat(path.join(tempDir, fixtures.dir, fixtures.script.name));

    expect(resultHtml).toBe(expectedHtml);
    expect(dirStats.isDirectory()).toBeTruthy();
    expect(imgStats.isFile()).toBeTruthy();
    expect(linkStats1.isFile()).toBeTruthy();
    expect(linkStats2.isFile()).toBeTruthy();
    expect(scriptStats.isFile()).toBeTruthy();
  });
});

describe('filesystem errors', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock(fixtures.base)
      .get(fixtures.html.path)
      .reply(200, rawHtml)
      .get(fixtures.img.path)
      .reply(200, expectedImg)
      .get(fixtures.link.path[0])
      .reply(200, expectedLink1)
      .get(fixtures.link.path[1])
      .reply(200, expectedLink2)
      .get(fixtures.script.path)
      .reply(200, expectedScript);
  });

  test('folder does not exist', async () => {
    const newTempDir = path.join(tempDir, '/nested_folder');
    await expect(pageLoader(fixtures.html.url, newTempDir)).rejects.toThrowError(/ENOENT/);
  });

  test('no access to folder', async () => {
    await fs.chmod(tempDir, 0);
    await expect(pageLoader(fixtures.html.url, tempDir)).rejects.toThrowError(/EACCES/);
  });
});

describe('network cases', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('404', async () => {
    nock(fixtures.base)
      .get(fixtures.html.path)
      .reply(404);

    await expect(pageLoader(fixtures.html.url, tempDir)).rejects.toThrowError(/404/);
  });

  test('500', async () => {
    nock(fixtures.base)
      .get(fixtures.html.path)
      .reply(500);

    await expect(pageLoader(fixtures.html.url, tempDir)).rejects.toThrowError(/500/);
  });
});
