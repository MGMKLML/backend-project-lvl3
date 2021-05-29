import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import pageLoader from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFilePath = (fileName) => path.join(__dirname, '__fixtures__', fileName);

describe('test', () => {
  test('1', () => {
    const expected = fs.readFileSync(getFilePath('test_file.txt'), 'utf-8');
    const res = pageLoader();
    expect(res.toString()).toBe(expected);
  });
});
