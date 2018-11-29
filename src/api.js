/*
    API.js
    -> used to fetch data from HorribleSubs.info
*/

// Imports
const request = require('request'), path = require('path');

// Everything happens here
class API {
    /*
        Used to fetch the list of available animes on HorribleSubs
    */
    fetchAnimes(callback) {
        // Get the HTML of the /shows/ page
        request('https://horriblesubs.info/shows/', {}, (err, res, body) => {
            // Create a "fake" DOM so we can execute Javascript on that page
            let tempDOM = document.createElement("html");
            tempDOM.innerHTML = body;

            // Data we'll need later on
            let returnData = [];
            let shows = tempDOM.querySelector(".shows-wrapper").querySelectorAll("a");
            
            // Go through all the shows link and parse them
            for(let s of shows) {
                returnData.push({
                    name: s.innerText,
                    code: path.basename(s.href)
                });
            }

            // Remove the temporary DOM.
            tempDOM = null;

            callback(returnData);
        });
    }

    /*
        Used to fech the list of episodes from a specific anime from HorribleSubs
    */
    fetchEpisodes(code, callback) {
        const returnData = {};

        request(`https://horriblesubs.info/shows/${code}/`, {}, (err, res, body) => {
            if(err) console.error(err);

            // Temporary DOM
            let tempDOM = document.createElement("html");
            tempDOM.innerHTML = body;

            // Get image
            let imageSrc = tempDOM.querySelector(".series-image img").src;

            // Using the fake DOM is fucking stupid and every url that does "/" will be loaded as "file:///" + something, this will fix this.
            if(!imageSrc.includes("horriblesubs")) {
                let split = imageSrc.split("/");
                let finalUrl = `https://horriblesubs.info/wp-content/uploads/${split[split.length - 3]}/${split[split.length - 2]}/${split[split.length - 1]}`;
                imageSrc = finalUrl;
            }
            returnData.image = imageSrc;

            /*
                This is a rather disgusting hack but it works, basically, HorribleSubs doesn't just output the list directly onto the anime page,
                instead, they have a one liner script that sets a variable named "hs_showid" which is then used to fetch the episodes via an API endpoint.
                This is the only way I've found to get the list of episodes.
                (This was actually changed, before I used to eval the actual script and "clone" the variable inside another one, this doesn't work here so I simply extract it by spltiing  it up)
            */
            const showid = tempDOM.querySelector(".entry-content script").innerText.split(" ")[3].replace(";" ,"").trim(); // Create a copy of that variable

            tempDOM = null;

            const episodesData = [];

            // Function used to parse a show episodes
            function parseShow(html, callback) {
                let tempDOM = document.createElement("html");
                tempDOM.innerHTML = html;

                let episodes = tempDOM.querySelectorAll(".rls-info-container");

                // Go through every episodes
                if(episodes.length > 0) {
                    for(let episode of episodes) {
                        let episodeID = episode.id;
                        let episodeQuality = [];
                        let episodeLinks = [];

                        // Get the quality format + magnet links
                        for(let quality of episode.querySelector(".rls-links-container").childNodes) {
                            if(quality.classList.contains("link-480p")) {
                                episodeQuality.push("480p");
                                episodeLinks.push(quality.querySelector(".hs-magnet-link").childNodes[0].href);
                            }
        
                            if(quality.classList.contains("link-720p")) {
                                episodeQuality.push("720p");
                                episodeLinks.push(quality.querySelector(".hs-magnet-link").childNodes[0].href);
                            }
        
                            if(quality.classList.contains("link-1080p")) {
                                episodeQuality.push("1080p");
                                episodeLinks.push(quality.querySelector(".hs-magnet-link").childNodes[0].href);
                            }
                        }

                        episodesData.push({
                            id: episodeID,
                            quality: episodeQuality,
                            links: episodeLinks
                        });
                    }

                    tempDOM = null;
                    callback(true);
                } else {
                    callback(false);
                }
            }

            // Request to get the list of episodes
            request(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${showid}`, {}, (err, res, body) => {
                if(err) console.error(err);

                // Inital fetch
                parseShow(body, (result) => {
                    // Recursive loop to check if there's still episodes to fetch
                    function fetchOthers(nextid) {
                        request(`https://horriblesubs.info/api.php?method=getshows&type=show&showid=${showid}&nextid=${nextid}`, {}, (err, res, body) => {
                            if(err) console.error(err);

                            parseShow(body, (result) => {
                                if(result) {
                                    fetchOthers(nextid + 1);
                                } else {
                                    returnData.episodes = episodesData;
                                    callback(returnData);
                                }
                            });
                        });
                    }

                    fetchOthers(1);
                });
            });
        });
    }
}

module.exports = new API();