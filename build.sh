#!/bin/bash

#Installation
##sudo apt install npm
##sudo apt-get install -y nodejs
##sudo npm install -g node-sass
##sudo npm install -g uglify-js

#compile css
echo "compile less to css"
node-sass --output-style=compressed scss/style.scss min/style.min.css

#compile js
echo "compile js to build.min.js"
uglifyjs --compress --output min/js.min.js \
js/vendor/jquery-3.2.1.min.js \
js/vendor/bootstrap.min.js \
js/vendor/raphael-min.js \
js/vendor/jquery.ba-tinypubsub.min.js \
js/vendor/routie.js \
js/vendor/classy.js \
js/app.js \
js/view/* \
js/automat/d1/* \
js/automat/d2/*


#compile templates:
#http://handlebarsjs.com/precompilation.html

read -p "Press any key to close" -n1 -s
