import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import prettier from 'prettier';
import buildName from './src/build-name.js';
import getAssetsData from './src/get-assets-data.js';
import replaceAssetsPaths from './src/replace-assets-paths.js';


export default (url, workingDir) => {
  const htmlName = buildName.file(url);
  const assetsDirName = buildName.folder(url);
  const htmlPath = path.resolve(path.join(workingDir, htmlName));
  const assetsPath = path.resolve(path.join(workingDir, assetsDirName));
  const config = {
    url, htmlName, htmlPath, assetsDirName, assetsPath, workingDir,
  };

  return axios.get(config.url)
    .then((response) => {
      const assets = getAssetsData(response.data, config);
      const html = replaceAssetsPaths(response.data, assets);
      return { assets, html };
    })
    .then(({ assets, html }) => {
      const prettyHtml = prettier.format(html, { parser: 'html', tabWidth: 4 }).trim();
      const writeFile = fs.writeFile(config.htmlPath, prettyHtml, 'utf-8');
    //   const makeDir = fs.mkdir(config.assetsPath);
    //   const axiosImages = images.map(({ href }) => {
    //     const axiosConfig = {
    //       method: 'get',
    //       url: href,
    //       responseType: 'stream',
    //     };
    //     return axios.request(axiosConfig);
    //   });

    //   return Promise.all([writeFile, makeDir, ...axiosImages]);
    })
    // .then(([, , ...responses]) => {
    //   responses.forEach((response) => {
    //     const image = response.data;
    //     const href = response.config.url;
    //     const imgPath = path.resolve(assetsPath, generateName.img(href));
    //     fs.writeFile(imgPath, image);
    //   });
    // })
    .then(() => config.htmlPath);
};
