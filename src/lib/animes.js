/*
    Anything that lets you get info from HorribleSubs
*/

// Node imports
const axios = require('axios'), cheerio = require('cheerio'), path = require('path');

// Root url of HorribleSubs
const URL = "https://horriblesubs.info";

/**
 * Fetch animes from a specific page
 */
const getAnimesFromPage = async (hsPage) => {
    // Axios request
    let response = await axios.get(`${URL}/${hsPage}`);

    // Check the status
    if(response.status != 200)
        return "An error happened";

    // Load the page
    let page = cheerio.load(response.data);

    // Get our shows
    let shows = page(".shows-wrapper a").toArray();

    // Array of our animes
    let animes = [];

    // Go through each animes and parse then
    shows.forEach(show => {
        animes.push({
            name: show.attribs.title,
            code: path.basename(show.attribs.href)
        });
    });

    // Free our page variable
    delete page;

    // Return our show
    return animes;
};

/**
 * Get the cover art of an anime
 */
const getCoverArt = async (code) => {
    // Fetcha the page
    let response = await axios.get(`${URL}/shows/${code}`);

    // Check the response
    if(response.status != 200) 
        return "An error happened";

    // Parse our page
    let page = cheerio.load(response.data);

    // Fetch our image
    let image = page(".series-image img").attr("src");

    // Fix for old covers that doesn't have the full path as their src
    if(!image.includes("horriblesubs")) 
        image = `${URL}${image}`;

    // Clear up cheerio
    delete page;

    // Return the image
    return image;
};

/**
 * Get the HorribleSubs ID of an anime
 */
const getAnimeID = async (code) => {
    // Request
    let response = await axios.get(`${URL}/shows/${code}`);

    // Check the response
    if(response.status != 200)
        return "An error happened";

    // Parse our page
    let page = cheerio.load(response.data);

    // Our script div
    let script;

    // A few pages can have a cloudflare script in there for some reasons, this is a way to filter it out.
    page(".entry-content script").each((index, element) => {
        let scriptContent = page(".entry-content script").eq(index).get(0);

        if(scriptContent.children.length > 0) 
            script = scriptContent.children[0].data;
    });

    // Parse the script (Fuck regex amiright)
    let showID = script.replace("var hs_showid = ", "").replace(";", "").trim();

    // Return the show ID
    return showID;
};

module.exports = new class {
    constructor() {}

    /**
     * Get a list of all animes
     */
    async getAllAnimes() {
        // Get our animes
        let animes = await getAnimesFromPage("shows");

        return animes;
    }

    /**
     * Get current animes
     */
    async getCurrentAnimes() {
        // Get our animes
        let animes = await getAnimesFromPage("current-season");

        // Get the cover images
        for(let anime of animes) {
            anime.cover = await getCoverArt(anime.code);
        }

        // Return the list
        return animes;
    }

    /**
     * Get anime's cover art
     */
    async getAnimeCover(code) {
        return await getCoverArt(code);
    }

    /**
     * Get anime's info
     */
    async getShowInfo(code) {
        // Get the HorribleSubs id of the anime
        let animeID = await getAnimeID(code);

        // Parse our show
        let parseShow = async (body) => {
            // Parser
            let page = cheerio.load(body);

            // List of episodes found
            let episodesList = page(".rls-info-container");

            // Do nothing if no episode were found
            if (episodesList.length == 0)
                return false;

            // Go through each episode
            episodesList.each((index, element) => {
                let qualities = [];
                let links = [];

                // List of links
                let linksContainer = episodesList.eq(index).find('.rls-links-container');

                // Get through all the available links
                linksContainer.children().each((index, element) => {
                    let link = linksContainer.children().eq(index);

                    // Get the quality format
                    let quality = link.attr('class').split(" ")[1].replace("link-", "").trim();

                    // Magnet link for that quality
                    let magnet = link.find('a[title="Magnet Link"]').attr('href');

                    // Add them to our arrays
                    qualities.push(quality);
                    links.push(magnet);
                });

                // Add this "episode" to the array of episodes
                episodes.push({
                    id: episodesList.eq(index).attr('id'),
                    qualities: qualities,
                    links: links
                });
            });

            return true;
        };

        // Fetch the next (Something something horriblesubs is weird)
        let fetchNext = async (pos) => {
            // Fetch the page
            let response = await axios.get(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${animeID}&nextid=${pos}`);
            
            // Is there episodes left?
            if(await parseShow(response.data))
                fetchNext(pos + 1);
            else 
                return;
        };

        // Episode list
        let episodes = [];

        // Fetch the anime episodes
        let response = await axios.get(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${animeID}`);

        // Get the status
        if(response.status != 200)
            return "An error happened";

        // Initial fetch
        parseShow(response.data);

        // Next fetch
        await fetchNext(1);

        // We're done lads
        return episodes;
    }
}