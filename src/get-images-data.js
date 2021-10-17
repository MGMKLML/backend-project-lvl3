import cheerio from 'cheerio';
import generateName from './generate-name.js';
import path from 'path';

export default (html, { url, assetsDirName }) => {
    const $ = cheerio.load(html);
    const imageSrcs = $('img').toArray().map((img) => {
        const origin = new URL(url).origin;
        const oldSrc = img.attribs.src;
        const href = new URL(oldSrc, origin).href;
        const newSrc = path.join(assetsDirName, generateName['img'](href));
        return { oldSrc, newSrc, href}
    });
    return imageSrcs;
}