import './style.css'

let svg

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
  for (let index = 0; index < stars.length; index++) {
    const star = stars[index]
    const el = svg.children[index]
    el.setAttribute('x', star.x)
    el.setAttribute('y', star.y)
  }
}

let frameId
function onFrame(time) {
  update()
  render()
  frameId = requestAnimationFrame(onFrame)
}

function start() {
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
  for (const star of stars) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    el.setAttribute('x', star.x)
    el.setAttribute('y', star.y)
    el.setAttribute('width', star.size)
    el.setAttribute('height', star.size)
    svg.appendChild(el)
  }
  document.body.appendChild(svg)

  frameId = requestAnimationFrame(onFrame)
}

start()
