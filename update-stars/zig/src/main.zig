const Star = extern struct {
    x: f32,
    y: f32,
    size: f32,
    velocity: f32,
    dx: f32,
    dy: f32,
    angle: f32,
};

export var stars: [10000]Star = undefined;

export fn update_stars(width: f32, height: f32) void {
    for (&stars) |*star| {
        star.*.x += star.*.dx * star.*.velocity;
        star.*.y += star.*.dy * star.*.velocity;
        if (star.*.x < 0 or star.*.x > width or star.*.y < 0 or star.*.y > height) {
            star.*.x = width / 2;
            star.*.y = height / 2;
        }
    }
}
