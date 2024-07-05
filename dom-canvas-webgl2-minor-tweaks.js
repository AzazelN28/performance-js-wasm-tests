import './style.css'
import vertexShaderSource from './shaders/unbuffered.v.glsl?raw'
import fragmentShaderSource from './shaders/color.f.glsl?raw'

let canvas, gl, program, vertexShader, fragmentShader
const stars = Array.from(new Array(10000), () => {
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
  return {
    x,
    y,
    angle,
    velocity,
    dx,
    dy,
    size,
  }
})

function update() {
  for (const star of stars) {
    star.x += star.dx * star.velocity
    star.y += star.dy * star.velocity

    if (
      star.x < 0 ||
      star.x > window.innerWidth ||
      star.y < 0 ||
      star.y > window.innerHeight
    ) {
      star.x = window.innerWidth / 2
      star.y = window.innerHeight / 2
    }
  }
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

  for (let index = 0; index < stars.length; index++) {
    const star = stars[index]
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_data'),
      star.x,
      star.y,
      star.size
    )
    gl.drawArrays(gl.POINTS, index, 1)
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

  gl.useProgram(program)

  frameId = requestAnimationFrame(onFrame)
}

start()
