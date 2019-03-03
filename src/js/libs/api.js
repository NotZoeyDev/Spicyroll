/*
    Fetch data from HorribleSubs using HTML parsing or their "api"
    By @ZoeyLovesMiki, 2019
*/

// Imports
const cheerio = require('cheerio'), request = require('request'), path = require('path');

// URL for HorribleSubs
const ROOT_URL = "https://horriblesubs.info";

// API class
export default {

    /**
     * Fetch the list of animes from a specific page
     * @param {String} url Name of the page you want to fetch of
     * @param {Function} callback (animes, err)
     */
    getAnimesFromPage(url, callback) {
        request(`${ROOT_URL}/${url}`, (err, response, body) => {
            if(err) callback(null, "Error trying to fetch the list of animes.");

            // Load our page using cheerio
            let page = cheerio.load(body);

            // Get our shows
            let shows = page(".shows-wrapper a").toArray();

            // Array of our animes
            let animes = [];

            // Go through each animes and parse then
            for(let show of shows) {
                animes.push({
                    name: show.attribs.title,
                    code: path.basename(show.attribs.href)
                });
            }

            // Free our page variable
            page = null;

            // Callback
            callback(animes, null);
        });
    },

    /**
     * Get the cover image of a specific anime
     * @param {String} code "Code" of the anime you wanna get 
     * @param {Functoin} callback (image, err)
     */
    getAnimeCoverImage(code, callback) {
        // Fetch the show HTML
        request(`${ROOT_URL}/shows/${code}`, (err, response, body) => {
            if(err) callback(null, "Error while trying to fetch the image cover.");

            // Load our page usinc cheerio
            let page = cheerio.load(body);

            // Fetch our image
            let image = page(".series-image img").attr("src");

            // Fix for old covers that doesn't have the full path as their src
            if(!image.includes("horriblesubs")) image = `${ROOT_URL}${image}`;

            // Clear up cheerio
            page = null;

            // Callback
            callback(image, null);
        });
    },

    /**
     * Get the HorribleSubs ID of a specfic anime via its 'code'
     * @param {String} code Anime code
     * @return {Promise} Returns the HorribleSubs ID of the anime specified
     */
    getAnimeID(code) {
        return new Promise((resolve, reject) => {
            // Get the show's page HTML
            request(`${ROOT_URL}/shows/${code}`, (err, response, body) => {
                if(err) reject("Error while fetching the list of episodes for an anime");

                // Load our page via cheerio
                let page = cheerio.load(body);

                // Our show id script
                let showidScript;

                // A few pages can have a cloudflare script in there for some reasons, this is a way to filter it out.
                page(".entry-content script").each((index, element) => {
                    let scriptContent = page(".entry-content script").eq(index).get(0);
                    if(scriptContent.children.length > 0) 
                        showidScript = scriptContent.children[0].data;
                });
                
                // Parse the script
                let showID = showidScript.replace("var hs_showid = ", "").replace(";", "").trim();
                
                // Return the showID
                resolve(showID);
            });
        });
    },

    /**
     * Fetch the list of animes in the current season
     * @return {Promise} The list of animes of the current season
     */
    fetchCurrentAnimes() {
        return new Promise((resolve, reject) => {
            this.getAnimesFromPage("current-season", (animes, err) => {
                if(err) reject(err);

                // Images to fetch
                let imagesToFetch = animes.length;

                // Fetch the cover images
                let fetchCovers = () => {
                    // Check if we have images to fetch
                    if(imagesToFetch == 0) {
                        resolve(animes);
                    } else {
                        // Get the anime cover image
                        this.getAnimeCoverImage(animes[imagesToFetch - 1].code, (imageURL, err) => {
                            if(err) reject(err);

                            // Assign the cover image to the right anime
                            animes[imagesToFetch - 1].cover = imageURL;

                            // One less image to fetch
                            imagesToFetch -= 1;

                            // Recursive functions are fun
                            fetchCovers();
                        });
                    }
                }

                // Run our recursive function
                fetchCovers();
            });
        });
    },

    /**
     * Fetch the list of animes available
     * @return {Promise} The list of animes available
     */
    fetchAnimes() {
        return new Promise((resolve, reject) => {
            this.getAnimesFromPage("shows", (animes, err) => {
                if(err) reject(err);

                resolve(animes);
            });
        });
    },

    /**
     * Fetch the list of episodes for a specific anime
     * @param {String} code Codename of the anime
     * @return {Promise} The list of episodes available for that anime
     */
    fetchEpisodes(code) {
        return new Promise((resolve, reject) => {
            // Get the ID for the anime we wanna get
            this.getAnimeID(code).then(showID => {
                // Array with our episodes
                let episodes = [];

                // Recursive function to get the remaining episodes
                let fetchNext = (showID, position) => {
                    request(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${showID}&nextid=${position}`, (err, response, body) => {
                        if(err) reject(err);

                        // Fetch the remaining episodes
                        fetchShow(body, (result) => {
                            // If there's no episode left, resolve, otherwise, fetch again
                            result 
                                ? fetchNext(showID, position + 1)
                                : resolve(episodes);
                        });
                    });
                }

                // Parse a "show"
                let fetchShow = (body, callback) => {
                    // Load our page inside cheerio
                    let page = cheerio.load(body);

                    // List of episodes
                    let episodesList = page(".rls-info-container");

                    // Stop when there's no more episodes to parse
                    if(episodesList.length == 0) {
                        callback(false);
                        return;
                    }

                    // Get our links
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

                    // Send our episodes back
                    callback(true);
                }

                // Fetch the anime data
                request(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${showID}`, (err, response, body) => {
                    if(err) reject(err);

                    // Fetch the show
                    fetchShow(body, result => { 
                        // Fetch next
                        fetchNext(showID, 1);
                    });
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}