const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

/*------------------------------------------
if not exsist in localStorage get empty array else
get json text and convert it to object json
------------------------------------------*/
let songs = JSON.parse(localStorage.getItem('songs')) || [];


/* ------------------------------------------
        Extract YouTube Video ID from URL
------------------------------------------- */
function extractYouTubeID(url) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

let currentView = 'table'; // default view

/* ------------------------------------------
        FORM SUBMIT (ADD or UPDATE)
------------------------------------------- */
form.addEventListener('submit', (e) => {
    /*------------------------------------------
    Dont submit the for to the server yet let me handle it here
    ------------------------------------------*/
    e.preventDefault();

    /*------------------------------------------
                Read Forms Data
    ------------------------------------------*/
    const id = document.getElementById('songId').value;
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = document.getElementById('rating').value; 


    /*------------------------------------------
        Extract YouTube Video ID
    ------------------------------------------*/
    const videoId = extractYouTubeID(url);

     if (!videoId) {
        alert("Invalid YouTube URL!");
        return;
    }

    if(id) {
        /* ------------------------------------------
                    UPDATE MODE
        ------------------------------------------ */
        const index = songs.findIndex(s => s.id == id);

        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = rating;

        /*------------------------------------------
            If URL changed — recalc thumbnail
        ------------------------------------------ */
        if (songs[index].videoId !== videoId) {
            songs[index].videoId = videoId;
            songs[index].thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        /*------------------------------------------
                        Reset button
        ------------------------------------------ */
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Song';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-success');

        document.getElementById('songId').value = '';
    }

    else{

        /*------------------------------------------
                        Add MODE
        ------------------------------------------ */

        const song = {
            id: Date.now(),  // Unique ID
            title: title,
            url: url,
            rating: rating,
            videoId: videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            dateAdded: Date.now()
        };

        songs.push(song);
    }

    
    saveAndRender();
    //TO DO SAVE  AND RERENDER
    form.reset();
});


/*------------------------------------------
            TO DO SAVE AND RERENDER 
------------------------------------------ */
function saveAndRender() {

    localStorage.setItem('songs', JSON.stringify(songs));
    
    /*------------------------------------------
                 RELOAD UI
    ------------------------------------------ */
    renderSongs();

}

function renderSongs() {
    list.innerHTML = ''; // Clear current list
    document.getElementById("cardsContainer").innerHTML = ''; // Clear cards container

    const sortType = document.querySelector('input[name="sort"]:checked').value;

    let sortedSongs = [...songs];

    if (sortType === 'nameAZ') {
        sortedSongs.sort((a, b) => a.title.localeCompare(b.title));     // A-Z
    }

    else if (sortType === "nameZA") {
        sortedSongs.sort((a, b) => b.title.localeCompare(a.title));     // Z-A
    }

    else if (sortType === "dateNew") {
        sortedSongs.sort((a, b) => b.dateAdded - a.dateAdded);      // newest first
    }

    else if (sortType === "dateOld") {
        sortedSongs.sort((a, b) => a.dateAdded - b.dateAdded);      // oldest first
    }

    else if (sortType === "rating") {
        sortedSongs.sort((a, b) => b.rating - a.rating);    // highest rating first
    }

    else if (sortType === "ratingLow") {
        sortedSongs.sort((a, b) => a.rating - b.rating);    // lowest rating first
    }


/*------------------------------------------
                Render sorted list
    ------------------------------------------ */
    if(currentView === 'table') {
        sortedSongs.forEach(song => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>
                    <img src="${song.thumbnail}" width="120" class="me-2 rounded">
                </td>
                <td>${song.title}</td>
                <td>${song.rating || "-"}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="openPlayer('${song.videoId}')">
                        <i class="fas fa-play"></i> Play
                    </button>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            list.appendChild(row);
        });
    }

    /*------------------------------------------
                Render Cards View
    ------------------------------------------ */
   if (currentView === "cards") {
       const container = document.getElementById("cardsContainer");

       sortedSongs.forEach(song => {
           const card = document.createElement("div");
           card.classList.add("col-md-4");

           card.innerHTML = `
               <div class="card bg-black border-light h-100">
                   <img src="${song.thumbnail}" class="card-img-top">
                   <div class="card-body">
                       <h5 class="card-title text-white">${song.title}</h5>
                       <p class="card-text text-white">Rating: ${song.rating}</p>

                       <button class="btn btn-info btn-sm" onclick="openPlayer('${song.videoId}')">
                           <i class="fas fa-play"></i> Play
                       </button>
                       <button class="btn btn-warning btn-sm" onclick="editSong(${song.id})"><i class="fas fa-edit"></i></button>
                       <button class="btn btn-danger btn-sm" onclick="deleteSong(${song.id})"><i class="fas fa-trash"></i></button>
                   </div>
               </div>
           `;

           container.appendChild(card);
       });
   }
}
/*------------------------------------------ 
            Edit Song Function
------------------------------------------ */
function editSong(id) {
    const song = songs.find(s => s.id === id);

    document.getElementById('songId').value = song.id;
    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating;

    /*------------------------------------------ 
                Change button to Update
    ------------------------------------------ */
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Song';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-primary');
}

/*------------------------------------------ 
            Delete Song
------------------------------------------ */
function deleteSong(id) {
    if(confirm('Are you sure you want to delete this song?')) {
        /*------------------------------------------ 
        Filter out the song with the matching ID
        ------------------------------------------ */
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

/*------------------------------------------ 
            Open YouTube Player
------------------------------------------ */
function openPlayer(videoId) {
    const url = `https://www.youtube.com/embed/${videoId}`;

    const playerWindow = window.open(
        "",
        "playerWindow",
        "width=550,height=400,top=200,left=300"
    );

    playerWindow.document.write(`
        <html>
        <head>
            <title>YouTube Player</title>
        </head>
        <body style="margin:0; background:#000;">
            <iframe 
                width="100%" 
                height="100%" 
                src="${url}" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>
        </body>
        </html>
    `);
}

/* TOGGLE VIEW */
 document.getElementById("toggleViewBtn").addEventListener("click", () => {
     if (currentView === "table") {
        currentView = "cards";
        document.getElementById("songList").parentElement.style.display = "none";
        document.getElementById("cardsContainer").style.display = "flex";
        document.getElementById("toggleViewBtn").innerHTML = '<i class="fas fa-th-large"></i> Cards View';
     } else {
        currentView = "table";
        document.getElementById("songList").parentElement.style.display = "";
        document.getElementById("cardsContainer").style.display = "none";
        document.getElementById("toggleViewBtn").innerHTML = '<i class="fas fa-table"></i> Table View';
     }

     renderSongs();
 });

document.querySelectorAll('input[name="sort"]').forEach(radio => {
    radio.addEventListener('change', () => renderSongs());
});

/*------------------------------------------ 
            Load songs on page load
------------------------------------------ */
renderSongs();
