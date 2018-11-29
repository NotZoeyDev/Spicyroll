# Spicyroll

Can I get uuhhhh, free animes?

# Seriously though

You'll need to (at the moment) change these two lines in `spicy.js`:  
Line 77: Change the path to whatever folder you want to save your animes to.  
Line 82: Change the path to the player you wanna use, for linux users, it could be as simple as "mpv" or whatever player you use.  
For windows users, you'll have to specify the full path of the player because fuck you.  

Also, don't forget to `npm install` to get electron installed and shit, who cares.  
This piece of shit of a software was only tested on Windows, no clue if it works on other stuff.  
No idea if HorribleSubs could block your ip from abusing this app, use at your own risk.  

# How this shit works

Basically I fetch one page from Horriblesubs to get their animes list, then with some fuckery, we can get the episodes list by extracting some JS variable stuck in the anime page and use that variable to fetch the episodes from their API (Yes, horriblesubs has somekind of API for whatever reasons) and we run a recursive loop there to get all the epsiodes available.  
You can find all that magic inside `api.js`, the UI code happens in `spicy.js`.

# Okay but why
Because I can, please hire me.