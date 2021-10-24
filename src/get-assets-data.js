import cheerio from 'cheerio';
import path from 'path';
import buildName from './build-name.js';
import _ from 'lodash';

const isAbsolute = (url) => new RegExp('^([a-z]+://|//)', 'i').test(url); 

const isSameDomain = (url1, url2) => {
    const { hostname: hostname1 } = new URL(url1);
    const { hostname: hostname2 } = new URL(url2);
    return hostname1 === hostname2;
}

const getAbsoluteUrl = (src, host) => {
    if (!isAbsolute(src)) {
        return new URL(src, host);
    }

    return src.startsWith('//') ? new URL(`https:${src}`) : new URL(src);
}


export default (html, { url, assetsDirName }) => {
    const { origin } = new URL(url);
    const $ = cheerio.load(html);
    const tags = ['img', 'link', 'script'];
    const assets = tags.map((tag) => {
        const tagData = $(tag).toArray().map((dom) => {
            const oldSrc = dom.attribs.src ?? ( dom.attribs.href ?? null );
            if (!oldSrc) return {};

            const { href } = getAbsoluteUrl(oldSrc, origin);
            if (!isSameDomain(origin, href)) return {};

            const newSrc = path.join(assetsDirName, buildName.file(href));
            return { oldSrc, newSrc, href, tag };
        });
        return tagData;
    });
    return assets.flat().filter((asset) => !_.isEmpty(asset));
};