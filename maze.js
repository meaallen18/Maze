"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

/*Sends GET request to TV Maze API, maps results to array */
async function getShowsByTerm(term) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  return response.data.map(show => ({
    id: show.show.id,
    name: show.show.name,
    summary: show.show.summary,
    /*Use default image if no image from API available*/
    image: show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing"
  }));
    }

/** Given list of shows, create markup for each and to DOM */

/*generates HTML for shows recieved by API, appends to show list */
function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
/*Gets value from search form, fetches shows matching search term by calling getShowByTerm*/
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
/*Hides episodes area, then populates show on page*/
  $episodesArea.hide();
  populateShows(shows);
}

/*evt listener triggered when form submitted, prevents page reoload*/
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  /*performs show search and displays it*/
  await searchForShowAndDisplay();
});

/*sends GET request to TV Maze API to get episodes of show, maps to array*/
async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
}

/*generates HTML for episodes receieved from API, appends to episodes list in area*/
function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  /*empties episodes list to before appending new episodes*/
  $episodesList.empty();

  for (let episode of episodes) {
    const $episode = $(
       `<li>
         ${episode.name} (season ${episode.season}, number ${episode.number})
       </li>`
    );
    $episodesList.append($episode);
  }
  $episodesArea.show();
}

/*Evt listener triggered when Show-getEpisodes is clicked*/
$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }