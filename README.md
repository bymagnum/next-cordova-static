# NextJs Cordova export

Use this package if you want to use nextjs in Cordova 

# Steps required

Install this package 
<pre>
npm install next-cordova-static
</pre>

Or:
<pre>
yarn add next-cordova-static
</pre>


This package will automatically start the build, as well as the export, will do everything necessary in the 'www' cordova folder.

I recommend saving the "www" folder before launching this package.

Add to your package.json (root nextjs) command:

<pre>
"build:cordova": "next-cordova-static"
</pre>


Versions:

1.3.5 - Minor fixes

1.3.4 - Minor fixes

1.3.2 - add recursive

1.1.0 - static build
