
build: components index.js lib/toc.css lib/template.js
	@component build --dev

lib/template.js: lib/template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components lib/template.js

.PHONY: clean
