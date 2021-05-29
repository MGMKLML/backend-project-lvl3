#Makefile
install:
			npm install

publish: 
			npm publish --dry-run

page-loader:
			node bin/page-loader.js

lint: 
			npx eslint .	

lintfix:
			npx eslint . --fix	

test:
			npm test

test-coverage:
			npm test -- --coverage --coverageProvider=v8