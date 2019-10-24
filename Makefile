.PHONY: default clean

default:
	npm install
	node app.js

clean:
	rm -rf node_modules

