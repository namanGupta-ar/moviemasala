
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const resultContainer = document.getElementsByClassName('result-container')[0];

// list button
const favouriteList = document.getElementById('favourite');

// Stop animation button
const stopAnimation = document.getElementById('stop-an');

// option buttons
const showFav = document.getElementById('show-fav');

onStart();

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    favouriteList.classList.remove('hide-fav-list');
    if(data.Response == "True") displayMovieList(data.Search);
}


// find movies related to search for suggestions
function findMovies(){
    // Getting values at the same time when entered by user
    let searchTerm = (movieSearchBox.value).trim(); 
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        resultContainer.classList.add('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}



// display search movie list***********************/
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

            let favItem;
        if(checkInLocalStorage(movies[idx].imdbID)){
             favItem = `<i class="fa-solid fa-heart-circle-minus fav-button rm-fav-btn"></i>`;
        }
        else{
            favItem = `<i class="fa-solid fa-heart-circle-plus fav-button add-fav-btn"></i>`;
        }
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
            ${favItem}
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

// check if movie is present in our local storage or not , to avoid duplication
function checkInLocalStorage(elementId)
{
    var All_ids = JSON.parse(localStorage.getItem('ids'));
                if(!All_ids.includes(elementId))
                {
                    return false;
                }
    return true;
}

// This refreshes favourite list every time if new movie is added or removed
function refreshList(data)
{
    console.log("refresh hua" ,data);
    var old_ids = JSON.parse(localStorage.getItem('ids'));
                var new_array = [];
                old_ids.forEach((value) => {
                    if(value!=data)
                    {
                        new_array.push(value);
                    }
                });
                localStorage.setItem('ids', JSON.stringify(new_array));
                favouriteMovieList(new_array);
}

// NOTE : if move is already present in favourite then remove button appears in suggestion list else add button
// it performs three options
// 1. if we click on add favourite button in suggestion list so it add that movie id in our local storage and refreshes list
// 2. if we click on remove favourite button in suggestion list then it  removes it from our local storage and refreshes list
// 3. if we click on movie so another page we shows all the details on that movie appears

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async (e) => {
            // console.log(movie.dataset.id);
            if(e.target.classList.contains("add-fav-btn"))
            {
                console.log(movie.dataset.id);
                if(localStorage.getItem('ids')==null)
                    {   
                        localStorage.setItem('ids','[]');
                    }

                    // yahan
                e.target.classList.remove('add-fav-btn','fa-heart-circle-plus');
                e.target.classList.add('fa-heart-circle-minus','rm-fav-btn');  
                
                var old_ids = JSON.parse(localStorage.getItem('ids'));
                if(!old_ids.includes(movie.dataset.id))
                {
                    old_ids.push(movie.dataset.id);
                    localStorage.setItem('ids', JSON.stringify(old_ids));
                }
                favouriteMovieList(old_ids);
            }else if(e.target.classList.contains("rm-fav-btn"))
            {
                var old_ids = JSON.parse(localStorage.getItem('ids'));
                var new_array = [];
                old_ids.forEach((value) => {
                    if(value!=movie.dataset.id)
                    {
                        new_array.push(value);
                    }
                });
                e.target.classList.remove('fa-heart-circle-minus','rm-fav-btn');
                e.target.classList.add('add-fav-btn','fa-heart-circle-plus');
                localStorage.setItem('ids', JSON.stringify(new_array));
                favouriteMovieList(new_array);
            }
            else{
                    searchList.classList.add('hide-search-list');
                    favouriteList.classList.add('hide-fav-list');
                    movieSearchBox.value = "";
                    const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
                    const movieDetails = await result.json();

                    displayMovieDetails(movieDetails);    
                    resultGrid.addEventListener('click' , (e) => {
                        if(e.target.classList.contains('movie-info-fav'))
                        {
                            if(!checkInLocalStorage(movieDetails.imdbID))
                            {
                                var old_ids = JSON.parse(localStorage.getItem('ids'));
                                old_ids.push(movieDetails.imdbID);
                                localStorage.setItem('ids', JSON.stringify(old_ids));
                                favouriteMovieList(old_ids);
                            }
                        }
                    });
                }
            
        });
    });
}

//******************************************** */




// This function takes an array in argument and find all movies to their corresponding id's and then displays it on our screen

async function favouriteMovieList(movies){
    favouriteList.innerHTML = `<p id="fav-title"><i class="fa-solid fa-crown"></i>Favourite Movies</p>`;
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        const result = await fetch(`http://www.omdbapi.com/?i=${movies[idx]}&apikey=fc1fef96`);
        const movieDetails = await result.json();
        movieListItem.classList.add('search-list-item','fav-list-item');
        movieListItem.dataset.id = movies[idx] // setting movie id in  data-id
        if(result.Poster != "N/A")
        moviePoster =  movieDetails.Poster;
        else
            moviePoster = "image_not_found.png";
            
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
            </div>
        <div class = "search-item-info">
            <h3>${movieDetails.Title}</h3>
            <p>${movieDetails.Year}</p>
            <i class="fa-solid fa-heart-circle-minus fav-button rm-fav-btn"></i>
            
            </div>
            `;
            favouriteList.appendChild(movieListItem);
    }
    loadFavMovieDetails();
}

// this function add event listener to all the movies in favourite list 
// so that we can see details of a particular movie or remove it from the list

function loadFavMovieDetails()
{
    const favListMovies = favouriteList.querySelectorAll('.fav-list-item');
    favListMovies.forEach(movie => {
        movie.addEventListener('click', async (e) => {
            if(e.target.classList.contains("rm-fav-btn"))
            {
                refreshList(movie.dataset.id);
            }else{
                searchList.classList.add('hide-search-list');
                    favouriteList.classList.add('hide-fav-list');
                    movieSearchBox.value = "";
                    const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
                    const movieDetails = await result.json();
                    displayMovieDetails(movieDetails); 
            }
                    
        })
    });
}


/*******************************************/
// This displays the movie details

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <div class="ratings">
            <h2>Imdb Rating</h2>
            <h2 class = "rated"><i class="fa-solid fa-star"></i>${details.imdbRating}/10</h2>
            <i class="fa-solid fa-heart movie-info-fav"></i>
        </div>

        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control" && !event.target.classList.contains("fav-button")){
        searchList.classList.add('hide-search-list'); // don't display it
        resultContainer.classList.remove('hide-search-list'); // display it
    }
    const clicked = event.target;
    // favourite list is not showed when we click anywhere except favourite button and search input
    if(clicked.className!='form-control' && clicked.id!='show-fav' && !clicked.classList.contains('fav-button') && !clicked.classList.contains('movie-info-fav'))
    {   
        favouriteList.classList.add('hide-fav-list');
    }
});


const logo = document.getElementById('nav-logo');

function onStart(){
    if(localStorage.getItem('ids')==null)
        {   
            localStorage.setItem('ids','[]');
        }

    var old_ids = JSON.parse(localStorage.getItem('ids'));
    favouriteMovieList(old_ids);

    showFav.addEventListener('click' , (e) => {
        favouriteList.classList.toggle('hide-fav-list');
    });


    // it remove animation from logo
    stopAnimation.addEventListener('click' , (e) =>{
        logo.classList.toggle('loader');
    })
}