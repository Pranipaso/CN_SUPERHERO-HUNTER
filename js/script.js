//*-------------------------------------- Selecting the element from DOM ----------------------------------------------------
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));
const publicKey = "7bc45e951d317717d9e477d0c0b30f75";
const hashkey = "9391af8c50a161724bc6cb8ad6fbfc24";

// function for API call
async function searchHeros(textSearched) {
  // if there is no text written in the search bar then nothing is displayed
  if (textSearched.length == 0) {
    searchResults.innerHTML = ``;
    return;
  }

  // API call to get the data
  await fetch(
    `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&ts=1&apikey=${publicKey}&hash=${hashkey}`
  )
    .then((res) => res.json()) //Converting the data into JSON format
    .then((data) => {
      //  console.log(data.data);
      showSearchedResults(data.data.results);
    }); //sending the searched results characters to show in HTML
}

// render the superheros
function showSearchedResults(searchedHero) {
  console.log(searchedHero);

  // get the favourite list from local storage
  // if its null then store an empty array else get the list
  let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
  if (favouritesCharacterIDs == null) {
    favouritesCharacterIDs = new Map();
  } else if (favouritesCharacterIDs != null) {
    favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );
  }

  searchResults.innerHTML = ``;
  searchedHero.slice(0, 5).map((hero, index) => {
    searchResults.innerHTML += `
             <li class="flex-row single-search-result">
                  <div class="flex-row img-info">
                       <img src="${
                         hero.thumbnail.path +
                         "/portrait_medium." +
                         hero.thumbnail.extension
                       }" alt="">
                       <div class="hero-info">
                            <a class="character-info" href="./more-info.html">
                                 <span class="hero-name">${hero.name}</span>
                            </a>
                       </div>
                  </div>
                  <div class="flex-col buttons">
                       <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                       <button class="btn add-to-fav-btn">${
                         favouritesCharacterIDs.has(`${hero.id}`)
                           ? '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites'
                           : '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites</button>'
                       }
                  </div>
                  <div style="display:none;">
                       <span>${hero.name}</span>
                       <span>${hero.description}</span>
                       <span>${hero.comics.available}</span>
                       <span>${hero.series.available}</span>
                       <span>${hero.stories.available}</span>
                       <span>${
                         hero.thumbnail.path +
                         "/portrait_uncanny." +
                         hero.thumbnail.extension
                       }</span>
                       <span>${hero.id}</span>
                       <span>${
                         hero.thumbnail.path +
                         "/landscape_incredible." +
                         hero.thumbnail.extension
                       }</span>
                       <span>${
                         hero.thumbnail.path +
                         "/standard_fantastic." +
                         hero.thumbnail.extension
                       }</span>
                  </div>
             </li>
             `;
  });

  events();
}

// eventListener for buttons
function events() {
  let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
  favouriteButton.forEach((btn) =>
    btn.addEventListener("click", addToFavourites)
  );

  let characterInfo = document.querySelectorAll(".character-info");
  characterInfo.forEach((character) =>
    character.addEventListener("click", addInfoInLocalStorage)
  );
}

// Function invoked when "Add to Favourites" button or "Remvove from favourites" button is click appropriate action is taken accoring to the button clicked
function addToFavourites() {
  if (
    // If add to favourites button is cliked then
    this.innerHTML ==
    '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'
  ) {
    let heroInfo = {
      name: this.parentElement.parentElement.children[2].children[0].innerHTML,
      description:
        this.parentElement.parentElement.children[2].children[1].innerHTML,
      comics:
        this.parentElement.parentElement.children[2].children[2].innerHTML,
      series:
        this.parentElement.parentElement.children[2].children[3].innerHTML,
      stories:
        this.parentElement.parentElement.children[2].children[4].innerHTML,
      portraitImage:
        this.parentElement.parentElement.children[2].children[5].innerHTML,
      id: this.parentElement.parentElement.children[2].children[6].innerHTML,
      landscapeImage:
        this.parentElement.parentElement.children[2].children[7].innerHTML,
      squareImage:
        this.parentElement.parentElement.children[2].children[8].innerHTML,
    };

    let favouritesArray = localStorage.getItem("favouriteCharacters");

    if (favouritesArray == null) {
      favouritesArray = [];
    } else {
      favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
    }

    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

    if (favouritesCharacterIDs == null) {
      favouritesCharacterIDs = new Map();
    } else {
      favouritesCharacterIDs = new Map(
        JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
      );
    }

    favouritesCharacterIDs.set(heroInfo.id, true);

    favouritesArray.push(heroInfo);
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );
    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(favouritesArray)
    );

    // Convering the "Add to Favourites" button to "Remove from Favourites"
    this.innerHTML =
      '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
    document.querySelector(".fav-toast").setAttribute("data-visiblity", "show");
    setTimeout(function () {
      document
        .querySelector(".fav-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  } else {
    // For removing the character form favourites array
    let idOfCharacterToBeRemoveFromFavourites =
      this.parentElement.parentElement.children[2].children[6].innerHTML;

    let favouritesArray = JSON.parse(
      localStorage.getItem("favouriteCharacters")
    );

    let favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );

    let newFavouritesArray = [];
    favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

    favouritesArray.forEach((favourite) => {
      if (idOfCharacterToBeRemoveFromFavourites != favourite.id) {
        newFavouritesArray.push(favourite);
      }
    });

    // Updating the new array in localStorage
    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(newFavouritesArray)
    );
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );

    // Convering the "Remove from Favourites" button to "Add to Favourites"
    this.innerHTML =
      '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';

    // Displaying the "Remove from Favourites" toast to DOM
    document
      .querySelector(".remove-toast")
      .setAttribute("data-visiblity", "show");
    // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
    setTimeout(function () {
      document
        .querySelector(".remove-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  }
}

function addInfoInLocalStorage() {
  // store data into the local storage for persistance
  let heroInfo = {
    name: this.parentElement.parentElement.parentElement.children[2].children[0]
      .innerHTML,
    description:
      this.parentElement.parentElement.parentElement.children[2].children[1]
        .innerHTML,
    comics:
      this.parentElement.parentElement.parentElement.children[2].children[2]
        .innerHTML,
    series:
      this.parentElement.parentElement.parentElement.children[2].children[3]
        .innerHTML,
    stories:
      this.parentElement.parentElement.parentElement.children[2].children[4]
        .innerHTML,
    portraitImage:
      this.parentElement.parentElement.parentElement.children[2].children[5]
        .innerHTML,
    id: this.parentElement.parentElement.parentElement.children[2].children[6]
      .innerHTML,
    landscapeImage:
      this.parentElement.parentElement.parentElement.children[2].children[7]
        .innerHTML,
    squareImage:
      this.parentElement.parentElement.parentElement.children[2].children[8]
        .innerHTML,
  };

  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
