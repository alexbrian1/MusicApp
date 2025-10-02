// Audio Player Functionality
class AudioPlayer {
  constructor() {
    this.audio = document.getElementById("audioPlayer")
    this.playPauseBtn = document.getElementById("playPauseBtn")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.progressSlider = document.getElementById("progressSlider")
    this.progressFill = document.getElementById("progressFill")
    this.volumeSlider = document.getElementById("volumeSlider")
    this.currentTimeEl = document.getElementById("currentTime")
    this.totalTimeEl = document.getElementById("totalTime")
    this.currentTrackTitle = document.getElementById("currentTrackTitle")
    this.currentTrackArtist = document.getElementById("currentTrackArtist")
    this.currentTrackImage = document.getElementById("currentTrackImage")

    this.currentTrackIndex = 0
    this.isPlaying = false
    this.tracks = []

    this.init()
  }

  async init() {
    await this.loadBeats()
    this.setupEventListeners()
    if (this.tracks.length > 0) {
      this.loadTrack(0)
    }
    if (this.audio) {
      this.audio.volume = 0.7
    }
  }

  async loadBeats() {
    try {
      const res = await fetch("beats.json")
      this.tracks = await res.json()
      const beatsGrid = document.getElementById("beatsGrid")
      beatsGrid.innerHTML = ""

      this.tracks.forEach((track, index) => {
        const card = document.createElement("div")
        card.classList.add("beat-card")
        card.dataset.track = index
        card.innerHTML = `
          <div class="beat-image">
            <img src="${track.image}" alt="${track.title}">
            <div class="play-overlay"><i class="fas fa-play"></i></div>
          </div>
          <div class="beat-info">
            <h4>${track.title}</h4>
            <p>${track.bpm} BPM • ${track.genre}</p>
            <span class="beat-price">$${track.price}</span>
          </div>`
        card.addEventListener("click", () => this.playTrack(index))
        beatsGrid.appendChild(card)
      })
    } catch (err) {
      console.error("Error cargando beats.json", err)
    }
  }

  loadTrack(index) {
    const track = this.tracks[index]
    this.currentTrackIndex = index
    this.currentTrackTitle.textContent = track.title
    this.currentTrackArtist.textContent = track.artist
    this.currentTrackImage.src = track.image
    this.audio.src = track.src
    this.totalTimeEl.textContent = this.formatTime(track.duration)
  }

  playTrack(index) {
    if (index !== this.currentTrackIndex) this.loadTrack(index)
    this.play()
  }

  togglePlayPause() {
    this.isPlaying ? this.pause() : this.play()
  }

  play() {
    this.isPlaying = true
    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
    this.audio.play()
  }

  pause() {
    this.isPlaying = false
    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
    this.audio.pause()
  }

  previousTrack() {
    const prevIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.tracks.length - 1
    this.playTrack(prevIndex)
  }

  nextTrack() {
    const nextIndex = this.currentTrackIndex < this.tracks.length - 1 ? this.currentTrackIndex + 1 : 0
    this.playTrack(nextIndex)
  }

  seekTo() {
    const seekTime = (this.progressSlider.value / 100) * this.audio.duration
    this.audio.currentTime = seekTime
  }

  setVolume() {
    const volume = this.volumeSlider.value / 100
    this.audio.volume = volume
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100
    this.progressSlider.value = progress
    this.progressFill.style.width = progress + "%"
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime)
  }

  updateDuration() {
    this.totalTimeEl.textContent = this.formatTime(this.audio.duration)
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  setupEventListeners() {
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause())
    this.prevBtn.addEventListener("click", () => this.previousTrack())
    this.nextBtn.addEventListener("click", () => this.nextTrack())
    this.progressSlider.addEventListener("input", () => this.seekTo())
    this.volumeSlider.addEventListener("input", () => this.setVolume())
    this.audio.addEventListener("timeupdate", () => this.updateProgress())
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration())
    this.audio.addEventListener("ended", () => this.nextTrack())
  }
}

document.addEventListener("DOMContentLoaded", () => new AudioPlayer())
