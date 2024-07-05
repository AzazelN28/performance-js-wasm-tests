#define MAX_STARS 10000

typedef struct star_ {
  float x, y, size, velocity, dx, dy, angle;
} star_t;

star_t stars[MAX_STARS];

void update_stars(int width, int height) {
  for (int i = 0; i < MAX_STARS; i++) {
    stars[i].x += stars[i].dx * stars[i].velocity;
    stars[i].y += stars[i].dy * stars[i].velocity;

    if (stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height) {
      stars[i].x = width / 2;
      stars[i].y = height / 2;
    }
  }
}
