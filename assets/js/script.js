var searchbutton = document.querySelector('.is-info')
var input = document.querySelector('#search')
var songListT = document.querySelector('.songList');
var videoLocation = document.querySelector('.boxVideo')
var lyricsLocation = document.querySelector('.boxLyrics')
var songSearches = [];
var previousSearch = document.querySelector('#searchHistory')
var youtubekey = 'AIzaSyClOnNDd4howxJo-Q-1PXhG2Y__Jo44jP4'
var video = ''

// when clicking the search button the result is then taken and given a variable 
$('#form').on('click', function (event) {
    event.preventDefault()
    var search = $('#search').val()
    songSearches.push(search);
    storeSong(songSearches);
    getSongs(search)
    //removes old lyrics and clears search bar on the click
    lyricsLocation.innerHTML = "";
    videoLocation.style.visibility = 'visible';
    lyricsLocation.style.visibility = 'visible';
    songListT.style.visibility = 'visible';
})

//takes value on the input variable and places it into the URL of the musixmatch API 
function getSongs(songTitle) {
    var apiUrl = 'https://api.musixmatch.com/ws/1.1/track.search?q_track=' + songTitle + '&page_size=5&s_track_rating=desc&apikey=6a4d09aa7c7bc21dd8f981caaf324cda';
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (currentData) {
                console.log(currentData);
                var songList = currentData.message.body.track_list;
                console.log(songList);
                displayList(songList);
            });
        } else {
            lyricsLocation.innerHTML = 'Error: ' + response.statusText;
        }
    })
        .catch(function (error) {
            lyricsLocation.innerHTML = 'Unable to connect to MusiXmatch';
        });
};

//stores the searches in local storage 
function storeSong() {
    localStorage.setItem("searchSong", JSON.stringify(songSearches));
    getSongHistory();
};

//takes song history
function getSongHistory() {
    songSearchList = JSON.parse(localStorage.getItem("searchSong"));
    if (!songSearchList) {
        console.log('no history yet');
    } else {
        console.log(songSearchList);
        printSongHistory(songSearchList);
    }
};

function printSongHistory(songSearchList) {
    previousSearch.innerHTML = '';
    for (var i = 0; i < songSearchList.length; i++) {
        var liEl2 = document.createElement("li");
        liEl2.addEventListener('click', function () {searching(event)})
        liEl2.textContent = songSearchList[i];
        previousSearch.appendChild(liEl2)[i];
    }
}

//clicking on your history searches for it again
function searching (event) {
console.log(event.target.value)
    event.preventDefault()
    var search = event.target.textContent
    getSongs(search)
    videoSearch(youtubekey, search, 5)
    //removes old lyrics and clears search bar on the click
    lyricsLocation.innerHTML = "";
    videoLocation.style.visibility = 'visible';
    lyricsLocation.style.visibility = 'visible';
    songListT.style.visibility = 'visible';
}

// once the songs are retreved this dynamically produces buttons into the 'Song Choices and Lyrics' box for the top five results  
function displayList(songArray) {
    var appendEl = document.querySelector(".list-group");
    appendEl.innerHTML = "";
    songArray.forEach(song => {
        var liEl = document.createElement("button")
        //give the buttons a click function that runs the apiFX function
        liEl.addEventListener("click", function () { apiFX(song.track.track_id, song.track.artist_name, song.track.track_name) })
        liEl.textContent = "Artist: " + song.track.artist_name + " - Song: " + song.track.track_name;
        liEl.classList.add("list-group-item", "songbuttons");
        appendEl.appendChild(liEl)
    })
}

//the buttons have data about each song from the API call this function takes the data from the previous call and puts it back into the API to then generate the lyrics into a new box 
function apiFX(songID, songArtist, songName) {
    var apiUrl2 = 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + songID + '&apikey=6a4d09aa7c7bc21dd8f981caaf324cda';
    console.log(apiUrl2);
    fetch(apiUrl2).then(function (response) {
        if (response.ok) {
            response.json().then(data => {
                console.log(lyrics);
                console.log(songArtist);
                console.log(songName);
                var lyricsPop = data['message']['body']['lyrics']['lyrics_body'];
                lyricsLocation.innerHTML = lyricsPop;
                lyricsLocation.innerHTML = lyricsPop;

            });
            // if there are no lyics assigned to a button it instead pastes 'no lyrics found'
            if (lyricsPop === undefined) {
                lyricsLocation.innerHTML = 'No lyrics found';
            }
        } else {
            lyricsLocation.innerHTML = 'Error: ' + response.statusText;
        }
    })
        .catch(function (error) {
            lyricsLocation.innerHTML = 'No Lyrics Found';
        });
}

//sets variables for youtubes api key and the search input on click
$('#form').on('click', function (event) {
    event.preventDefault()
    console.log('clicked')
    var search = $('#search').val()
    //declares variables for the videoSearch function
    videoSearch(youtubekey, search, 5)
    console.log(search.value)
})

//takes the variables runs them through the youtube API and then dynamically generates the videos on the right
function videoSearch(key, search, maxResults) {
    $('#videos').empty()
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key +
        '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search, function (data) {
            console.log(data)
            data.items.forEach(item => {
                video = `
                <iframe class="has-ratio" width="360" height="360" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" 
                allowfullscreen></iframe>
                `
                $('#videos').append(video)
            });
        })
}

