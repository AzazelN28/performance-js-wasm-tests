import './style.css'

let canvas, context
const stars = Array.from(new Array(10000), () => {
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight
  const angle = Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2)
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const velocity = Math.random() * 10
  const size = Math.random() * 3
  return {
    x,
    y,
    angle,
    velocity,
    dx,
    dy,
    size
  }
})

function update() {
  for (const star of stars) {
    star.x += star.dx * star.velocity
    star.y += star.dy * star.velocity

    if (star.x < 0 || star.x > window.innerWidth || star.y < 0 || star.y > window.innerHeight) {
      star.x = window.innerWidth / 2
      star.y = window.innerHeight / 2
    }
  }
}

function render() {
  if (canvas.width !== window.innerWidth) {
    canvas.width = window.innerWidth
  }

  if (canvas.height !== window.innerHeight) {
    canvas.height = window.innerHeight
  }

  context.clearRect(0,0,window.innerWidth,window.innerHeight)
  for (let index = 0; index < stars.length; index++) {
    const star = stars[index]
    context.fillStyle = 'white'
    context.fillRect(star.x, star.y, star.size, star.size)
  }
}

let frameId
function onFrame(time) {
  update()
  render()
  frameId = requestAnimationFrame(onFrame)
}

function start() {
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  context = canvas.getContext('2d')

  frameId = requestAnimationFrame(onFrame)
}

start()
