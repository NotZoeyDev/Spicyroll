# Spicyroll

Can I get uuhhhh, free animes?

# How to use
No precompilled binaries quite yet (Waiting for an icon to be made).  
Simply `git clone` the repo, `npm install` and then `npm start` to use the latest version.  
The app will now asks you to set your save location and player path on launch.  

# How this shit works

Basically, it fetch one page from Horriblesubs to get their animes list, then with some fuckery, we can get the episodes list by extracting some JS variable stuck in the anime page and use that variable to fetch the episodes from their API (Yes, horriblesubs has somekind of API for whatever reasons) and we run a recursive loop there to get all the epsiodes available.  
You can find all that magic inside `api.js`, the UI code happens in `spicy.js`.

# Okay but why
Because I can, please hire me.