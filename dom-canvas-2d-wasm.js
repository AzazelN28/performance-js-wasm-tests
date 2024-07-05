import './style.css'

const numStars = 10000

let canvas, gl, program, vertexShader, fragmentShader, buffer, starsArray, wasm

// 10000 estrellas por 7 atributos y cada atributo ocupa 4 bytes (Float 32)
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

  frameId = requestAnimationFrame(onFrame)
}

start()
