let container = document.querySelector(`.album`);
let playlist = document.querySelector(`.playlist`);

let album = getAlbum()

if(!album) {
    renderError();
} else {
    renderAlbumInfo();

    renderTracks();

    setupAudio();
}




function setupAudio() {
    // Найди коллекцию с треками
    let trackNodes = document.querySelectorAll(`.track`);
    let tracks = album.tracks
    for (let i = 0; i < trackNodes.length; i++) { 
        // Один элемент
        let node = trackNodes[i];
        let timeNode = node.querySelector(`.time`)   
        // Тег аудио внутри этого элемента
        let audio = node.querySelector(`.audio`);
        let track = tracks[i]
        let imgPause = node.querySelector(`.img-pause`)
        let imgPlay = node.querySelector(`.img-play`)
        let progress = node.querySelector(`.progress-bar`) 

        node.addEventListener(`click`, function () {
            // Если трек сейчас играет...
            if (track.isPlaying) {
                track.isPlaying = false;
                // Поставить на паузу
                audio.pause();
                imgPause.classList.remove(`d-none`)
                imgPlay.classList.add(`d-none`)
            // Если трек сейчас не играет...
            } else {
                track.isPlaying = true;
                // Включить проигрывание
                audio.play();
                imgPause.classList.add(`d-none`)
                imgPlay.classList.remove(`d-none`)
                updateProgress();
            }
        });
        function updateProgress() {
            // Нарисовать актуальное время
            timeNode.innerHTML = getTime(audio.currentTime);
            progress.style.width = `${ProgressBar()}%`
          
            // Нужно ли вызвать её ещё раз?
            if (track.isPlaying) {
                  requestAnimationFrame(updateProgress);
            }
            
          }
          function ProgressBar() {
            let percent = Math.floor((audio.currentTime / audio.duration) * 100)
    
            return percent
        }
        // продолжи самостоятельно
    }
    function getTime(time) {
        let currentSecond = Math.floor(time);
        let minutes = Math.floor(currentSecond / 60);
        let seconds = Math.floor(currentSecond % 60)
        if(minutes < 10) {
            minutes = `0` + minutes
        }
        if(seconds < 10) {
            seconds = `0` + seconds
        }
        return `${minutes}:${seconds}`
    }
}


function getAlbum() {
    let search = new URLSearchParams(window.location.search);
    let i = search.get(`i`);
    let album = albums[i];

    return album
}

function renderError() {
    container.innerHTML += `Ошибка`;
}

function renderAlbumInfo() {
    container.innerHTML = `
    <div class="card mb-3">
    <div class="row">
        <div class="col-md-4">
            <img src="${album.img}" alt="" class="img-fluid rounded-start">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${album.title}</h5>
                <p class="card-text">${album.description}</p>
                <p class="card-text"><small class="text-muted">${album.year}</small></p>
            </div>
        </div>
    </div>
    </div>
`
}

function renderTracks() {
    let tracks = album.tracks;
    for(let i = 0; i < tracks.length; i++) {
        let track  = tracks[i];
        playlist.innerHTML += `
            <li class="track list-group-item d-flex align-items-center">
                <img class="img-pause" src="assets/notplaying.png" alt="" height="30px" class="me-3">
                <img class="img-play d-none" src="assets/playing.png" alt="" height="30px" class="me-3">
                <div>
                    <div class="w-25">${track.title}</div>
                    <div class="author w-25">${track.author}</div>
                </div>
                <div class="progress w-100 ms-4">
                    <div class="progress-bar float-end" style="width: 0%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="ms-auto time">${track.time}</div>
                <audio class="audio" src="${track.src}"></audio>
            </li>
        `
    }
}