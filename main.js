import './style.css'
import vertexShaderSource from './shaders/buffered.v.glsl?raw'
import fragmentShaderSource from './shaders/color.f.glsl?raw'

// TODO: Utilizar transform feedback para actualizar la posición de las estrellas.

const options = new URL(location).searchParams
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
  let resized = false
  if (canvas.width !== window.innerWidth) {
    canvas.width = window.innerWidth
    resized = true
  }

  if (canvas.height !== window.innerHeight) {
    canvas.height = window.innerHeight
    resized = true
  }

  if (resized) {
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  }

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  if (resized) {
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      window.innerWidth,
      window.innerHeight
    )
  }

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, starsArray)

  gl.drawArrays(gl.POINTS, 0, numStars)
}

let frameId
function onFrame(time) {
  update()
  render()
  frameId = requestAnimationFrame(onFrame)
}

function getModuleByLanguage(language) {
  return `update-stars-${language}.wasm`
}

async function loadWebAssemblyModule() {
  const response = await fetch(getModuleByLanguage(options.get('lang') ?? 'c'))
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

  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  gl = canvas.getContext('webgl2')

  vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader))
  }

  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader))
  }

  program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
  }

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, starsArray, gl.DYNAMIC_DRAW)

  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 7 * 4, 0)

  gl.useProgram(program)

  frameId = requestAnimationFrame(onFrame)
}

start()
