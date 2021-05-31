import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import getFileName from './src/make-filename.js';

export default (url, dir) => {
  const fileName = getFileName(url);
  const outputPath = path.resolve(path.join(dir, fileName));
  return axios.get(url)
    .then((response) => fs.writeFile(outputPath, response.data)
      .then(() => outputPath));
};
