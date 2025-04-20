export class AudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map()

  playSound(src: string | undefined) {
    if (!src) return

    let audio = this.audioCache.get(src)
    if (!audio) {
      audio = new Audio(src)
      this.audioCache.set(src, audio)
    }

    audio.load()
    audio.play().catch((err) => {
      console.warn(`Failed to play sound ${src}:`, err)
    })
  }
}
