use wasm_bindgen::prelude::*;

#[derive(Copy, Clone)]
pub struct Star {
    x: f32,
    y: f32,
    size: f32,
    velocity: f32,
    dx: f32,
    dy: f32,
    angle: f32,
}

#[no_mangle]
#[used]
pub static mut stars: [Star;10000] = [Star { x: 0.0, y: 0.0, size: 0.0, velocity: 0.0, dx: 0.0, dy: 0.0, angle: 0.0}; 10000];

#[no_mangle]
#[wasm_bindgen]
pub unsafe fn update_stars(width: f32, height: f32) {
  for i in 0..10000 {
      let star = &mut stars[i];
      star.x += star.dx * star.velocity;
      star.y += star.dy * star.velocity;

      if star.x < 0.0 || star.x > width || star.y < 0.0 || star.y > height {
          star.x = width / 2.0;
          star.y = height / 2.0;
      }
  }
}
