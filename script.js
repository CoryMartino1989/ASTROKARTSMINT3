document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 AstroKarts Widget Loaded!");

    const music = document.getElementById("background-music");
    const musicBtn = document.getElementById("music-btn");
    let isPlaying = false;

    // 🎵 Background Music Control
    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            music.pause();
            musicBtn.textContent = "🎵 Play Music";
        } else {
            music.play();
            musicBtn.textContent = "⏸ Pause Music";
        }
        isPlaying = !isPlaying;
    });

    // 🛸 Custom UFO Cursor
    const ufoCursor = document.createElement("img");
    ufoCursor.src = "assets/ufo-cursor.png";
    ufoCursor.classList.add("ufo-cursor");
    document.body.appendChild(ufoCursor);

    document.addEventListener("mousemove", (e) => {
        ufoCursor.style.left = `${e.clientX}px`;
        ufoCursor.style.top = `${e.clientY}px`;
    });
});
