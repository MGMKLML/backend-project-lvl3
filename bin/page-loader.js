#!/usr/bin/env node

import program from 'commander';
import process from 'process';
import pageLoader from '../index.js';

program
  .version('1.0.0')
  .description('Page loader utility')
  .arguments('<url>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((url, options) => {
    pageLoader(url, options.output)
      .then((filePath) => console.log(filePath))
      .catch((message) => {
        console.error(message);
        process.exit(1);
      });
  });

program.parse();
