function Explosion(extendSprite, pos) {
    explosion_sound.play();
    Sprite.__init__(self, pos, (0, 0), 0, 0, explosion_image, explosion_img, None, false);

    function destroy() {
        explosions.remove(self);
    }

    function draw(canvas) {
        // animiate background
        time += 1;
        wtime = (time / 8) % center[0];
        canvas.draw_image(nebula_image, nebula_img.get_center(), nebula_img.get_size(), [WIDTH / 2, HEIGHT / 2], [WIDTH, HEIGHT]);
        canvas.draw_image(debris_image, [center[0] - wtime, center[1]], [size[0] - 2 * wtime, size[1]], [WIDTH / 2 + 1.25 * wtime, HEIGHT / 2], [WIDTH - 2.5 * wtime, HEIGHT]);
        canvas.draw_image(debris_image, [size[0] - wtime, center[1]], [2 * wtime, size[1]], [1.25 * wtime, HEIGHT / 2], [2.5 * wtime, HEIGHT]);

        if (game_over == true) {
            canvas.draw_text("GAME OVER (Click to continue)", (150, HEIGHT / 2), 40, "Red");
            canvas.draw_text("Score: " + str(score), (370, HEIGHT / 2 + 40), 30, "Red");
            return;
        }

        // draw ship and sprites
        my_ship.draw(canvas);

        for (rock in rocks) {
            rock.draw(canvas);
        }

        for (missle in missiles) {
            if (missle[0] + MISSILE_LIFETIME < time) {
                missiles.remove(missle);
            } else {
                missle[1].draw(canvas);

                for (rock in rocks) {
                    if (dist(missle[1].pos, rock.pos) <= missle[1].radius + rock.radius) {
                        explosions.append(new Explosion(rock.pos));
                        rocks.remove(rock);
                        missiles.remove(missle);

                        // determine if big rock exploded
                        if (rock.radius == asteroid_img.radius) {
                            pos1 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos2 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos3 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));

                            spawn_rock(pos1, false);
                            spawn_rock(pos2, false);
                            spawn_rock(pos3, false);
                        }

                        score += 1;

                        break;
                    }
                }
            }
        }

        for (explosion in explosions) {
            explosion.draw(canvas);
        }

        // draw score
        score_str = 'Score: ' + str(score);
        canvas.draw_text(score_str, (10, 20), 24, "White");

        // draw lives
        lives_str = 'Lives: ' + str(lives)
        canvas.draw_text(lives_str, (WIDTH - 100, 20), 24, "White")
    }
}