#!/bin/bash
touch resources.js
echo "//Array of resource files"> resources.js
for dir in */; do 
	echo "" >> resources.js; #newline
	echo "var ${dir:0:-1} = [" >> resources.js;
	for file in $dir/*; do
		echo "\"$dir${file:${#dir}+1}\"," >> resources.js;
	done
	echo "];" >> resources.js;
done

