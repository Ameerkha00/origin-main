const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

//========== static folder is client folder ==========
app.use(express.static(path.join(__dirname, "client")));

const songs = [
    {
        id: 1,
        title: "Shape of You",
        artist: "Ed Sheeran",
        year: 2017,
        duration: "3:53"
    },

    {
        id: 2,
        title: "Believer",
        artist: "Imagine Dragons",
        year: 2017,
        duration: "3:24"
    },
    
    {
        id: 3,
        title: "On & On",
        artist: "Cartoon ft. Daniel Levi",
        year: 2015,
        duration: "3:28"
    }
];

// Route to return ALL songs
app.get("/api/songs", (req, res) => {
    res.json(songs);
});

// Route to return ONE song by ID
app.get("/api/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const song = songs.find(s => s.id === id);

    if (!song) {
        return res.status(404).json({ error: "Song not found" });
    }

    res.json(song);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "client/home.html"));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "client/home.html"));
});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

