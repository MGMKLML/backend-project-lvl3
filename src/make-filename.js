export default (link) => {
  const url = new URL(link);
  const nameWithSlashes = `${url.hostname}${url.pathname}`;
  const nameWithoutSlashes = nameWithSlashes.replace(/[^a-zA-Z0-9]/g, '-');
  const extension = 'html';
  return `${nameWithoutSlashes}.${extension}`;
};
