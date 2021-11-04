import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';
import 'axios-debug-log';
import axios from 'axios';
import prettier from 'prettier';
import buildName from './src/build-name.js';
import getAssetsData from './src/get-assets-data.js';
import replaceAssetsPaths from './src/replace-assets-paths.js';
import FriendlyError from './src/FriendlyError.js';
import Listr from 'listr';

const log = debug('page-loader');

export default (url, workingDir) => {
  log('generating paths');
  const htmlName = buildName.file(url);
  const assetsDirName = buildName.folder(url);
  const htmlPath = path.resolve(path.join(workingDir, htmlName));
  const assetsPath = path.resolve(path.join(workingDir, assetsDirName));
  const config = {
    url, htmlName, htmlPath, assetsDirName, assetsPath, workingDir,
  };
  log(`html file name is ${config.htmlName}`);
  log(`assets dir name is ${config.assetsDirName}`);
  log(`html path is ${config.htmlPath}`);
  log(`assets path is ${config.assetsPath}`);
  log('preparing to download html');
  return axios.get(config.url)
    .then((response) => {
      log('preparing to replace links');
      const assets = getAssetsData(response.data, config);
      log(`found ${assets.length} assets`);
      const html = replaceAssetsPaths(response.data, assets);
      log('links replaced');
      return { assets, html };
    })
    .then(({ assets, html }) => {
      const prettyHtml = prettier.format(html, { parser: 'html', tabWidth: 2 }).trim();
      const writeFile = fs.writeFile(config.htmlPath, prettyHtml, 'utf-8');
      log(`html downloaded to ${config.htmlPath}`);
      const makeDir = fs.mkdir(config.assetsPath);
      log(`asset directory created at ${config.assetsPath}`);

      const axiosAssets = assets.map(({ href }) => {
        const axiosConfig = {
          method: 'get',
          url: href,
          responseType: 'stream',
        };
        return axios.request(axiosConfig);
      });
      
      return Promise.all([writeFile, makeDir, ...axiosAssets]);
    })
    .then(([, , ...responses]) => {
      const tasks = responses.map((response) => {
        const asset = response.data;
        const href = response.config.url;
        const assetLocation = path.resolve(assetsPath, buildName.file(href));
        return {
          title: `write asset ${href}`,
          task: () => fs.writeFile(assetLocation, asset) 
        }
      });
      return new Listr(tasks, { concurrent: true, exitOnError: false }).run();
    })
    .then(() => config.htmlPath)
    .catch((error) => {
      throw new FriendlyError(error);
    });
};
