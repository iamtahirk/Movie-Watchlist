import OMDB_API_KEY from './apikey.js';

const formSubmit = document.getElementById('searchmovies');
const searchInput = document.getElementById('movieinput');

const initialMsg = document.getElementById('initialmsg');
const errorMsg = document.getElementById('errormsg');
const displayErrorMsg = document.getElementById('displayerror');

const addWatchlist = document.getElementById('addwatchlist');
const moviesContainer = document.getElementById('moviescontainer');

// Initialize different Messages
const startScreen = () => {
    initialMsg.classList.remove('hideme');
    errorMsg.classList.remove('hideme');
    moviesContainer.classList.remove('hideme');
    
    errorMsg.classList.add('hideme');
    moviesContainer.classList.add('hideme');
}

const errorScreen = () => {
    initialMsg.classList.remove('hideme');
    errorMsg.classList.remove('hideme');
    moviesContainer.classList.remove('hideme');

    initialMsg.classList.add('hideme');
    moviesContainer.classList.add('hideme');
}

const moviesList = () => {
    initialMsg.classList.remove('hideme');
    errorMsg.classList.remove('hideme');
    moviesContainer.classList.remove('hideme');


    initialMsg.classList.add('hideme');
    errorMsg.classList.add('hideme');
}

startScreen();

const fetchMovies = async (e) => {
    e.preventDefault();

    // Make sure to import your API Key
    const searchedMovie = searchInput.value;
    try {
        if (searchedMovie)  {
            moviesContainer.innerHTML = '';
            const response = await fetch (`https://www.omdbapi.com/?apiKey=${OMDB_API_KEY}&s=${searchedMovie}`);
            const data = await response.json();
            
            if (data.Error === 'Movie not found!') {
                displayErrorMsg.textContent = "Unable to find what you’re looking for. Please try another search!!";
                errorScreen();
            } else {
                moviesList();
    
                data.Search.forEach(element => {
                    fetchIDs(OMDB_API_KEY, element.imdbID);
                });
            }
        } else {
            displayErrorMsg.textContent = "Please provide a movie name to search for!!";
            errorScreen();
        }
    } catch (error) {
        // console.log(error.message);
        displayErrorMsg.textContent = "Unable to find what you’re looking for. Please try another search!!";
        errorScreen();
    }

    searchInput.value = '';
}

const fetchIDs = async (api, id) => {
    const responseIDs = await fetch (`https://www.omdbapi.com/?apiKey=${api}&i=${id}`);
    const dataIDs = await responseIDs.json();

    moviesContainer.innerHTML += renderMovies(dataIDs);
}

// Render Movies
const renderMovies = (movie) => {
    let moviePoster = chkPoster(movie);
    let movieplot = chkPlot(movie);
    let watchlistHTML = chkIfMovieStored(movie.imdbID);

    const renderHMTL = renderHTML(movie, moviePoster, movieplot, watchlistHTML);
    return renderHMTL;
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
const renderHTML = (movie, poster, plot, wlist) => {
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
                                ${wlist}
                            </div>
                        </div>

                        ${plot}
                    </div>
                </div>`;
}

// Add to watchlist
const addToWatchlist = (parent, id) => {
    parent.innerHTML = `<img src="./images/checked.png" width="16" height="16" style="width: 16px; height: 16px;"> Added`;

    chkLocalStorageNotEmpty();

    let movies = JSON.parse(localStorage.getItem('movieIDs'));
    movies.push(id);

    localStorage.setItem('movieIDs', JSON.stringify(movies));
}

// Check if already added
const chkIfMovieStored = (id) => {
    chkLocalStorageNotEmpty();
    let localMovies = JSON.parse(localStorage.getItem('movieIDs'));

    for (let i = 0; i < localMovies.length; i++) {
        if(localMovies[i] === id) {
            return `<img src="./images/checked.png" width="16" height="16" style="width: 16px; height: 16px;"> Added`
        }
    }
    return `<button class="add-watchlist" id="addwatchlist" data-movieid=${id}><img src="./images/add-icon.png" width="16" height="16" style="width: 16px; height: 16px;">Watchlist</button>`;
}

// Check for localStorage key, set it if empty
const chkLocalStorageNotEmpty = () => {
    if (localStorage.getItem('movieIDs') == null) {
        localStorage.setItem('movieIDs', '[]');
    }
}

document.addEventListener('click', function(e){
    if(e.target.dataset.movieid){
        // console.log(e.target.dataset.movieid, e.target.parentElement)
        addToWatchlist(e.target.parentElement,e.target.dataset.movieid) 
    }
})


formSubmit.addEventListener('submit', fetchMovies);