import cheerio from 'cheerio';
import path from 'path';
import generateName from './generate-name.js';

export default (html, { url, assetsDirName }) => {
  const $ = cheerio.load(html);
  const imageSrcs = $('img').toArray().map((img) => {
    const { origin } = new URL(url);
    const oldSrc = img.attribs.src;
    const { href } = new URL(oldSrc, origin);
    const newSrc = path.join(assetsDirName, generateName.img(href));
    return { oldSrc, newSrc, href };
  });
  return imageSrcs;
};
