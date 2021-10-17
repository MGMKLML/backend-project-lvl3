const generateFileName = (link) => {
  const url = new URL(link);
  const raw = `${url.hostname}${url.pathname}`;
  const target = raw.replace(/[^a-zA-Z0-9]/g, '-');
  return `${target}.html`;
};

const generateFolderName = (link) => {
  const url = new URL(link);
  const raw = `${url.hostname}${url.pathname}`;
  const target = raw.replace(/[^a-zA-Z0-9]/g, '-');
  return `${target}_files`;
};

const generateImageName = (link) => {
  const url = new URL(link);
  const hostname = url.hostname.replace(/[^a-zA-Z0-9]/g, '-');
  const pathname = url.pathname.replace(/[^a-zA-Z0-9.]/g, '-');
  return `${hostname}${pathname}`;
};

export default {
  html: generateFileName,
  dir: generateFolderName,
  img: generateImageName,
};
