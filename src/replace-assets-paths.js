import cheerio from 'cheerio';

export default (html, assets) => {
  const $ = cheerio.load(html);
  assets.forEach(({ oldSrc, newSrc, tag, attr }) => {
    const selector = `${tag}[${attr}="${oldSrc}"]`;
    $(selector).attr(attr, newSrc);
  });
  return $.root().html();
};
