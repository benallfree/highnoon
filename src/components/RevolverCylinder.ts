import van, { State } from 'vanjs-core'

const { div } = van.tags

export const RevolverCylinder = (remainingShots: State<number>, rotation: State<number>) => {
  const rotationDegrees = van.derive(() => rotation.val * 60)

  return div(
    {
      class: 'revolver-cylinder',
      style: () => `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 100px;
        height: 100px;
        background:rgb(132, 117, 117);
        border-radius: 50%;
        border: 8px solid #1a1a1a;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3);
        transform: rotate(${rotationDegrees.val}deg);
        transform-origin: center center;
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      `,
    },
    // Create 6 bullet chambers
    ...Array(6)
      .fill(0)
      .map((_, i) => {
        const angle = i * 60
        const radius = 35 // Increased radius to move bullets more toward the outside
        // Calculate position relative to center
        const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180)
        const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180)

        return div({
          style: () => `
            position: absolute;
            width: 20px;
            height: 20px;
            background: ${i < remainingShots.val ? '#d4af37' : '#1a1a1a'};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            left: ${x}%;
            top: ${y}%;
            transition: background-color 0.3s ease;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
            border: 2px solid ${i < remainingShots.val ? '#ffd700' : '#333'};
          `,
        })
      })
  )
}
