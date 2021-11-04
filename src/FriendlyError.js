import axios from 'axios';

const generateErrorMessage = (error) => {
  const {
    code, response, config, message, address, path, port,
  } = error;
  if (axios.isAxiosError(error)) {
    return [
      'Error occurred during execution',
      `Code: ${code}`,
      `Message: ${message}`,
      `URL: ${config.url}`,
      response && `Status: ${response.status}`,
      response && `Text: ${response.statusText}`,
    ].filter((str) => !!str).join('\n');
  }

  return [
    'Error occurred during execution',
    `Code: ${code}`,
    `Message: ${message}`,
    address && `Address: ${address}`,
    path && `Path: ${path}`,
    port && `Port: ${port}`,
  ].filter((str) => !!str).join('\n');
};

export default class FriendlyError extends Error {
  constructor(error) {
    super(error);
    this.message = generateErrorMessage(error);
  }
}
