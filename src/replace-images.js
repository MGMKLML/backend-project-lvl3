import cheerio from 'cheerio';

export default (html, images) => {
  const $ = cheerio.load(html);
  images.forEach(({ oldSrc, newSrc }) => {
    $(`img[src="${oldSrc}"]`).attr('src', newSrc);
  });
  return $.root().html();
};
