# Custom Gulp Build
My custom gulp build for personal web developing
<br></br>
<br></br>
# USAGE:

**"node i"** to download node modules

**"gulp --tasks"** to view available tasks

**"gulp"** run main gulp loop with live server and file auto convert


<br></br>
<br></br>
# IMPORTANT INFO:

By default all files without **"_"** prefix going to convert to distr directory;

add **"_"** as file prefix in scripts, scss , etc dir to ignore file
<br></br>
example:
**"src/scss/file.scss"** converts to **"dist/css/file.min.css"**

**"src/scss/_file.scss"** is ignored

<br></br>
<br></br>
# CUSTOMIZATION
By default **"src"** dir contains developers "raw" files (e.g., scss, pug).

Gulp build converts **"raw"** to browser friendly production to **"dist"** dir

In gulpfile.js you can find paths variables that can be customized to change I/O dirs
