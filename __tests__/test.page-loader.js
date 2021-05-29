import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFilePath = (fileName) => path.join(__dirname, '__fixtures__', fileName);

describe('test', () => {
  test('1', () => {
    getFilePath('test_file.txt');
    expect(5).toBe(5);
  });
});
