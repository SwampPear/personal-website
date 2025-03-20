all:
	rm -rf ./static/pocket/*
	cp -r ../../pocket/src/* ./static/pocket
	
	npx webpack
	python3 manage.py runserver 3000