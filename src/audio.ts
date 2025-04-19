// Draw sounds
import draw1 from './fx/draw/draw1.mp3'
import draw2 from './fx/draw/draw2.mp3'
import draw3 from './fx/draw/draw3.mp3'
import draw4 from './fx/draw/draw4.mp3'

// Empty click sound
import emptyClick from './fx/empty-click/11L-gun_empty_hammer_cli-1745101300930.mp3'

// Got me sounds
import gotMe1 from './fx/got-me/11L-a_cowboy_being_hit_w-1745101189167.mp3'
import gotMe2 from './fx/got-me/11L-a_cowboy_being_hit_w-1745101192015.mp3'
import gotMe3 from './fx/got-me/11L-a_cowboy_being_hit_w-1745101192924.mp3'
import gotMe4 from './fx/got-me/11L-a_cowboy_being_hit_w-1745101193820.mp3'

// Gunshot sounds
import gunshot1 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100781226.mp3'
import gunshot2 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100783689.mp3'
import gunshot3 from './fx/gunshot/11L-pistol_gun_shot,_old-1745100784972.mp3'
import gunshot6 from './fx/gunshot/11L-revolver_gun_shot-1745100702465.mp3'
import gunshot7 from './fx/gunshot/11L-revolver_gun_shot-1745100705388.mp3'
import gunshot4 from './fx/gunshot/11L-revolver_gun_shot_ri-1745100735689.mp3'
import gunshot5 from './fx/gunshot/11L-revolver_gun_shot_ri-1745100738680.mp3'

// Hit sounds
import hit1 from './fx/hit/11L-bullet_hitting_flesh-1745101243743.mp3'
import hit2 from './fx/hit/11L-bullet_hitting_flesh-1745101245448.mp3'
import hit3 from './fx/hit/11L-bullet_hitting_flesh-1745101246085.mp3'
import hit4 from './fx/hit/11L-bullet_hitting_flesh-1745101247094.mp3'

// Miss sounds
import miss1 from './fx/miss/11L-bullet_whizzing_by_m-1745100867199.mp3'
import miss2 from './fx/miss/11L-bullet_whizzing_by_m-1745100869647.mp3'
import miss3 from './fx/miss/11L-bullet_whizzing_by_m-1745100876181.mp3'

// Reload sounds
import reload1 from './fx/reload/11L-gun_revolver_reload-1745101308751.mp3'

// Ricochet sounds
import ricochet1 from './fx/ricochet/11L-gun_shot_ricochet-1745100806405.mp3'
import ricochet2 from './fx/ricochet/11L-gun_shot_ricochet-1745100822553.mp3'
import ricochet3 from './fx/ricochet/11L-gun_shot_ricochet-1745100824795.mp3'

const drawSounds = [draw1, draw2, draw3, draw4].map((src) => new Audio(src))
const emptyClickSound = new Audio(emptyClick)
const gotMeSounds = [gotMe1, gotMe2, gotMe3, gotMe4].map((src) => new Audio(src))
const gunshotSources = [gunshot1, gunshot2, gunshot3, gunshot4, gunshot5, gunshot6, gunshot7]
const gunshotSounds = gunshotSources.map((src) => new Audio(src))
const hitSounds = [hit1, hit2, hit3, hit4].map((src) => new Audio(src))
const missSounds = [miss1, miss2, miss3].map((src) => new Audio(src))
const reloadSounds = [reload1].map((src) => new Audio(src))
const ricochetSounds = [ricochet1, ricochet2, ricochet3].map((src) => new Audio(src))

// Preload all sounds
const preloadSounds = () => {
  const allSounds = [
    ...drawSounds,
    ...gotMeSounds,
    ...gunshotSounds,
    ...hitSounds,
    ...missSounds,
    ...reloadSounds,
    ...ricochetSounds,
  ]
  allSounds.forEach((audio) => {
    audio.load()
  })
}

// Play a random sound from a given array of sounds
const playRandomSound = (sounds: HTMLAudioElement[]) => {
  const randomIndex = Math.floor(Math.random() * sounds.length)
  const sound = sounds[randomIndex]
  sound.currentTime = 0
  sound.play()
}

// Get a consistent gunshot sound for a player
const getPlayerGunshot = (playerId: string) => {
  // Use a simple hash function to get a consistent index
  const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % gunshotSounds.length
  return gunshotSounds[index]
}

// Play a consistent gunshot sound for a player
const playPlayerGunshot = (playerId: string) => {
  const sound = getPlayerGunshot(playerId)
  sound.currentTime = 0
  sound.play()
}

export const playEmptyClick = () => {
  emptyClickSound.currentTime = 0
  emptyClickSound.play()
}

export const playRandomGunshot = () => playRandomSound(gunshotSounds)
export const playRandomDraw = () => playRandomSound(drawSounds)
export const playRandomGotMe = () => playRandomSound(gotMeSounds)
export const playRandomHit = () => playRandomSound(hitSounds)
export const playRandomMiss = () => playRandomSound(missSounds)
export const playRandomReload = () => playRandomSound(reloadSounds)
export const playRandomRicochet = () => playRandomSound(ricochetSounds)
export { playPlayerGunshot }

// Initialize sound preloading
preloadSounds()
