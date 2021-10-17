import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import generateName from './src/generate-name.js';

export default (url, workingDir) => {
  const htmlName = generateName.html(url);
  const assetsDirName = generateName.dir(url);
  const htmlPath = path.resolve(path.join(workingDir, htmlName));
  const assetsPath = path.resolve(path.join(workingDir, assetsDirName));
  const config = {
    url, htmlName, htmlPath, assetsDirName, assetsPath, workingDir,
  };
  return axios.get(config.url)
    .then((response) => fs.writeFile(htmlPath, response.data)
      .then(() => htmlPath));
};
