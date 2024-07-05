package main

Star :: struct #packed {
  x, y, size, velocity, dx, dy, angle: f32,
}

NUM_STARS :: 10000

@export
stars: [NUM_STARS]Star;

@export
get_stars_pointer :: proc() -> ^[NUM_STARS]Star {
  return &stars;
}

@export
update_stars :: proc(width: f32, height: f32) {
  for i := 0; i < NUM_STARS; i += 1 {
    stars[i].x += stars[i].dx * stars[i].velocity;
    stars[i].y += stars[i].dy * stars[i].velocity;

    if stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height {
      stars[i].x = width / 2;
      stars[i].y = height / 2;
    }
  }
}
