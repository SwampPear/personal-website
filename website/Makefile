.PHONY: cp-src build runserver clean

# builds an runs documentation site
docs: cp-src build runserver

# copies build artifacts
cp-src:
	cp ../../taffy/dist/taffy.js ./src/
	cp ../../taffy/src/styles/taffy.css ./static/css

# builds typescript
build:
	npx webpack

# runs the server
runserver:
	python3 manage.py runserver 3000
