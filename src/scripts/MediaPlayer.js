const mediaPlayer = document.getElementById('mediaPlayer');
const playButton = document.getElementById('play_button');
const pauseButton = document.getElementById('pause_button');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const progressBar = document.getElementById('progressBar');
const progressBarContainers = document.getElementsByClassName('.progressBarContainer'); 
const progressBarContainer = progressBarContainers[0];
const music = new Audio();

function getAlbumImage(album) {
  switch (album.toLowerCase()) {
    case 'clancy':
      return '/imgs/clancy-top.jpeg';
    case 'blurryface':
      return '/imgs/blurryface-top.png';
    case 'heathens':
      return '/imgs/heathens-top.jpeg';
    default:
      return; 
  }
}

function updateMediaPlayer(song) {
  albumCover.src = getAlbumImage(song.album);
  songTitle.textContent = song.name;
  artistName.textContent = song.artist;
  music.src = song.src;
  music.load();
  mediaPlayer.classList.remove('hidden');
  localStorage.setItem('currentSong', JSON.stringify(song));
  localStorage.setItem('isPlaying', !music.paused);
  localStorage.setItem('currentTime', music.currentTime);
}

function togglePlayPause() {
  if (music.paused) {
    music.play().catch(console.error);
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
  } else {
    music.pause();
    playButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
  }
  localStorage.setItem('isPlaying', !music.paused);
}

function updateProgressBar() {
  if (music.duration) {
    const progress = (music.currentTime / music.duration) * 100;
    progressBar.style.width = `${progress}%`;
  }
}


music.addEventListener('ended', () => {
  music.currentTime = 0;
  playButton.classList.remove('hidden');
  pauseButton.classList.add('hidden');
  updateProgressBar();
  localStorage.setItem('currentTime', music.currentTime);
});

let isDragging = false;

function handleProgressBarClick(event) {
    const progressBarWidth = progressBarContainer.clientWidth;
    const clickX = event.clientX - progressBarContainer.getBoundingClientRect().left;
    const newTime = (clickX / progressBarWidth) * music.duration;
    music.currentTime = newTime;
    localStorage.setItem('currentTime', music.currentTime);
  }
  
  function handleMouseMove(event) {
    if (isDragging) {
      handleProgressBarClick(event);
    }
  }
  

  if (progressBarContainer) {
    progressBarContainer.addEventListener('click', handleProgressBarClick);
    progressBarContainer.addEventListener('mousedown', () => {
      isDragging = true;
    });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

function onSongClick(event) {
  const songElement = event.currentTarget;
  const song = {
    id: parseInt(songElement.getAttribute('data-song-id')),
    src: songElement.getAttribute('data-song-src'),
    name: songElement.getAttribute('data-song-name'),
    artist: songElement.getAttribute('data-song-artist'),
    album: songElement.getAttribute('data-song-album')
  };

  updateMediaPlayer(song);
  music.play().catch(console.error);
  playButton.classList.add('hidden');
  pauseButton.classList.remove('hidden');
}

music.addEventListener('timeupdate', updateProgressBar);

playButton.addEventListener('click', togglePlayPause);
pauseButton.addEventListener('click', togglePlayPause);

function initializeMediaPlayer() {
  const song = JSON.parse(localStorage.getItem('currentSong'));
  const isPlaying = localStorage.getItem('isPlaying') === 'true';
  const currentTime = parseFloat(localStorage.getItem('currentTime'));

  if (song) {
    updateMediaPlayer(song);
    music.currentTime = currentTime;
  }

  if (isPlaying) {
    music.play().catch(console.error);
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
  }
}

initializeMediaPlayer();

document.querySelectorAll('.song-item').forEach(item => {
  item.addEventListener('click', onSongClick);
});
