import * as THREE from 'three'
import van, { State } from 'vanjs-core'
import { Gun } from '../gun'
import { DebugPanel } from './DebugPanel'
import { ReloadButton } from './ReloadButton'
import { RevolverCylinder } from './RevolverCylinder'

const { div } = van.tags

export const Crosshair = () =>
  div(
    {
      style: `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      z-index: 2;
      color: rgba(255, 255, 255, 0.8);
      font-size: 24px;
      user-select: none;
      text-shadow: 0 0 5px rgba(0,0,0,0.5);
      `,
    },
    '+'
  )

export const GameContainer = (props: { renderer: THREE.WebGLRenderer; children: any }) =>
  div(
    {
      style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    `,
    },
    props.renderer.domElement,
    props.children
  )

export const GameHUD = (props: {
  isDebugVisible: State<boolean>
  sessionGun: Gun
  remainingShots: State<number>
  cylinderRotation: State<number>
  mousePosition: State<{ x: number; y: number }>
  onReload: () => void
}) => {
  return div(
    {
      style: `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
      `,
    },
    div(
      { style: 'pointer-events: auto; position: fixed; top: 0; left: 0;' },
      DebugPanel(props.isDebugVisible, props.sessionGun, props.remainingShots, props.mousePosition)
    ),
    div(
      { style: 'pointer-events: auto; position: fixed; top: 20px; right: 20px;' },
      RevolverCylinder(props.remainingShots, props.cylinderRotation)
    ),
    div(
      { style: 'pointer-events: auto; position: fixed; top: 140px; right: 20px;' },
      ReloadButton(props.remainingShots, props.sessionGun, props.onReload)
    )
  )
}
