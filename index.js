import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import prettier from 'prettier';
import generateName from './src/generate-name.js';
import getImagesData from './src/get-images-data.js';
import replaceImages from './src/replace-images.js';

export default (url, workingDir) => {
  const htmlName = generateName.html(url);
  const assetsDirName = generateName.dir(url);
  const htmlPath = path.resolve(path.join(workingDir, htmlName));
  const assetsPath = path.resolve(path.join(workingDir, assetsDirName));
  const config = {
    url, htmlName, htmlPath, assetsDirName, assetsPath, workingDir,
  };

  return axios.get(config.url)
    .then((response) => {
      const images = getImagesData(response.data, config);
      const html = replaceImages(response.data, images);
      return { images, html };
    })
    .then(({ images, html }) => {
      const prettyHtml = prettier.format(html, { parser: 'html', tabWidth: 4 }).trim();
      const writeFile = fs.writeFile(config.htmlPath, prettyHtml, 'utf-8');
      const makeDir = fs.mkdir(config.assetsPath);
      const axiosImages = images.map(({ href }) => {
        const axiosConfig = {
          method: 'get',
          url: href,
          responseType: 'stream',
        };
        return axios.request(axiosConfig);
      });

      return Promise.all([writeFile, makeDir, ...axiosImages]);
    })
    .then(([, , ...responses]) => {
      responses.forEach((response) => {
        const image = response.data;
        const href = response.config.url;
        const imgPath = path.resolve(assetsPath, generateName.img(href));
        fs.writeFile(imgPath, image);
      });
    })
    .then(() => config.htmlPath);
};
