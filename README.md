### Currently re-writing the whole app, this is the old README, will be updated for release

# Spicyroll 
An easy-to-use anime streaming app made with Electron!  
![alt text](https://github.com/NotZoeyDev/Spicyroll/blob/master/screen.png?raw=true "App screenshot")

# Features  
* Streams any anime you want with only a few clicks  
* Downloads single episodes or entire animes with a single right click  
* That's pretty much all it does, it does it well though  

# How to use  
On first launch, the app will ask you to set up your save location for animes and it'll ask you to set up your video player.  
Just a tip, for linux users, you should be able to set your video player by simply typing the command name. eg: "mpv" should work.  
Clicking on the "spicyroll" text will bring back the setting menu if something goes wrong.  

# Tips   
* Single click on an anime name will bring up the modal to select which episode you want to watch.
* Right click on an anime name will bring up a menu to download the entire anime with your preferred quality.
* Right click on a specific quality while in the modal will let you download this episode specfically.
* There's a special spicyroll:// protocol available, you can load an anime directly by loading spicyroll://anime_name and it will load up as soon as you launch the app.

# Disclaimer
This app is *illegal*, as in, the app doesn't host or own any illegal content but it is to access copyrighted content.  
The app upon itself is legal but its use might not be.  
To make it clearer, the app basically fetch animes and information from [horriblesubs](https://horriblesubs.info) and presents it to the users with a nicer interface.
Use at your own risk.

# For dev
You can copy `api.js` and use it in any your own app or script to fetch data easily from Horriblesubs for your own use.

# Packages used
God bless [WebTorrent](https://github.com/webtorrent/webtorrent) for being easy to use!  
[Electron-store](https://github.com/sindresorhus/electron-store) was also used to store the settings easily.  
[request](https://github.com/request/request) used to easily fetch data from websites.  