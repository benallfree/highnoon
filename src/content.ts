import van from 'vanjs-core'
import { Overlay } from './components/Overlay'
import { guns } from './gun'

console.log('Content script loaded')

// Select the Remington 1858 for this session
const sessionGun = guns.remington1858

van.add(document.body, Overlay(sessionGun))
