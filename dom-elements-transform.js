import './style.css'

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
    const el = document.body.children[index]
    el.style.transform = `translate(${star.x}px, ${star.y}px)`
  }
}

let frameId
function onFrame(time) {
  update()
  render()
  frameId = requestAnimationFrame(onFrame)
}

function start() {
  const fragment = document.createDocumentFragment()
  for (const star of stars) {
    const el = document.createElement('div')
    el.style.transform = `translate(${star.x}px, ${star.y}px)`
    el.style.width = `${star.size}px`
    el.style.height = `${star.size}px`
    fragment.appendChild(el)
  }
  document.body.appendChild(fragment)

  frameId = requestAnimationFrame(onFrame)
}

start()
