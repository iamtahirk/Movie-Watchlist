import OMDB_API_KEY from './apikey.js';

const emptyWatchList = document.getElementById('emptymsgcontainer');
const movieContainer = document.getElementById('moviescontainer');

const renderStoredMovies = () => {
    let localMovies = JSON.parse(localStorage.getItem('movieIDs'));
    for (let i = 0; i < localMovies.length; i++) {
        // console.log(localMovies[i]);
        fetchMovies(localMovies[i]);
    }
}

const fetchMovies = async (id) => {
    // Make sure to import your API Key
    const response = await fetch (`https://www.omdbapi.com/?apiKey=${OMDB_API_KEY}&i=${id}`);
    const data = await response.json();
    movieContainer.innerHTML += renderMovies(data);
}

const renderMovies = (movie) => {
    let movieposter = chkPoster(movie);
    let movieplot = chkPlot(movie);
    let movieID = movie.imdbID;
    return renderHTML(movie, movieposter, movieplot, movieID);
}

// Check if Poster is available
const chkPoster = (el) => {
    // Check of Poster Available/Not Available
    if (el.Poster === 'N/A') {
        return `../images/poster.png`;
    } else {
        return el.Poster;
    }
}

// Check if movie plot is available
const chkPlot = (el) => {
    // Check of Plot is Available/Not Available
    if (el.Plot === 'N/A') {
        return `<div class="movie-description setwidthplot"><p>Plot Not found!!</p></div>`
    } else {
        return `<div class="movie-description setwidthplot"><p>${el.Plot}</p></div>`
    }
}
// Render HTML Movie Block
const renderHTML = (movie, poster, plot, id) => {
    return `<div class="movie-block">
                <div class="movie-poster">
                    <img src="${poster}" alt="${movie.Title}" width="120" height="180" style="width:120px;height:180px;">
                </div>
                <div class="movie-info">
                    <div class="movie-title">
                        <h2>${movie.Title}</h2>
                        <div class="rating">
                            <img src="./images/star-icon.png" alt="star" width="15" height="15" style="width:15px;height:15px;">
                            <span class="rating-value">${movie.imdbRating}</span>
                        </div>
                    </div>
                    <div class="runtime-genre">
                        <div class="runtime">
                            <span class="runtime-value">${movie.Runtime}</span>
                        </div>
                        <div class="genre">
                            <span class="genre-value">${movie.Genre}</span>
                        </div>

                        <div class="addwatchlist">
                            <button class="add-watchlist" id="removewatchlist"  data-removemovie=${id}><img src="./images/remove-icon.png" width="16" height="16" style="width: 16px; height: 16px;">Remove</button>
                        </div>
                    </div>
                    ${plot}
                </div>
            </div>`;
}

// Remove from LocalStorage
const removeFromWatchlist = (id) => {
    let movies = JSON.parse(localStorage.getItem('movieIDs'));

    for (let i = 0; i < movies.length; i++) {
        if(movies[i] === id) {
            movies.splice(i,1);
        }
    }

    localStorage.clear();

    localStorage.setItem('movieIDs', JSON.stringify(movies));
    location.reload();
}

document.addEventListener('click', function(e){
    if(e.target.dataset.removemovie){
        removeFromWatchlist(e.target.dataset.removemovie) 
    }
})

const init = () => {
    if(JSON.parse(localStorage.getItem('movieIDs')).length <= 0 || localStorage.getItem('movieIDs') == null) {
        emptyWatchList.classList.remove('hideme');
        movieContainer.classList.remove('hideme');

        movieContainer.classList.add('hideme');
    } else {
        emptyWatchList.classList.remove('hideme');
        movieContainer.classList.remove('hideme');

        emptyWatchList.classList.add('hideme');
        renderStoredMovies();
    }
}

init();