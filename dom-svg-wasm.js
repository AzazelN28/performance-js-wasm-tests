import './style.css'

const numStars = 10000

let svg, starsArray, wasm
function initStars() {
  for (let i = 0; i < numStars; i++) {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const angle = Math.atan2(
      y - window.innerHeight / 2,
      x - window.innerWidth / 2
    )
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const velocity = Math.random() * 10
    const size = Math.random() * 3

    const offset = i * 7
    starsArray[offset + 0] = x
    starsArray[offset + 1] = y
    starsArray[offset + 2] = size
    starsArray[offset + 3] = velocity
    starsArray[offset + 4] = dx
    starsArray[offset + 5] = dy
    starsArray[offset + 6] = angle
  }
}

function update() {
  wasm.instance.exports.update_stars(window.innerWidth, window.innerHeight)
}

function render() {
  for (let index = 0; index < numStars; index++) {
    const offset = index * 7
    const el = svg.children[index]
    el.setAttribute('x', starsArray[offset + 0])
    el.setAttribute('y', starsArray[offset + 1])
  }
}

let frameId
function onFrame(time) {
  update()
  render()
  frameId = requestAnimationFrame(onFrame)
}

async function loadWebAssemblyModule() {
  const response = await fetch('update-stars-c.wasm')
  const arrayBuffer = await response.arrayBuffer()
  const module = await WebAssembly.instantiate(arrayBuffer)
  return module
}

async function start() {
  wasm = await loadWebAssemblyModule()
  starsArray = new Float32Array(
    wasm.instance.exports.memory.buffer,
    wasm.instance.exports.stars.value,
    numStars * 7
  )
  initStars()

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
  for (let index = 0; index < numStars; index++) {
    const offset = index * 7
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    el.setAttribute('x', starsArray[offset + 0])
    el.setAttribute('y', starsArray[offset + 1])
    el.setAttribute('width', starsArray[offset + 2])
    el.setAttribute('height', starsArray[offset + 2])
    svg.appendChild(el)
  }
  document.body.appendChild(svg)

  frameId = requestAnimationFrame(onFrame)
}

start()
