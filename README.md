Intro:
======
This is a bare-bones electron app that uses jQuery, Twitter's Bootstrap for
styling, and Photon kit for icons (http://photonkit.com/) without any other extraneous 
modules.  The only node_modules dependences are: bootstrap, jquery, and tether.  


Snake Nostalgia:
================
For experimentation, this is a popular snake game prototype just to play with electron & see its power.

Prerequisites:
==============
* nodejs is required https://nodejs.org/en/download/
* Prebuilt Electron ```npm install -g electron```

If you are on a corporate proxy there are various `npm config set` options to
tweek in order to download npm modules.

For the first time setup:
=========================
Issue the following commands after having the prerequisites:
* ```git clone https://github.com/arifpavel/Snake-Nostalgia-using-Electron```
* ```cd electron-jquery-bootstrap```
* ```npm install```
* ```electron .```

After first setup:
==================
After closing the app for the first time, it can be restarted via ```electron .```

Build Standalone win32(windows),MacOS or Linux App:
===================================================

Please use electron build package https://github.com/electron-userland/electron-packager

==========
Thank You
