function Explosion(extendSprite, pos) {
    explosion_sound.play();
    Sprite.__init__(self, pos, (0, 0), 0, 0, explosion_image, explosion_info, None, false);

    function destroy(self) {
        explosions.remove(self);
    }

    function draw(canvas) {
        if (slowmo_enabled == true) {
            slowmo = Math.max(slowmo - SLOWMO_SUB_DELTA, 0);
            if (slowmo == 0) {
                slowmo_enabled = false
            }
        }

        // animiate background
        time += 1;
        wtime = (time / 8) % center[0];
        canvas.draw_image(nebula_image, nebula_info.get_center(), nebula_info.get_size(), [WIDTH / 2, HEIGHT / 2], [WIDTH, HEIGHT]);
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

            if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                rock.update();
            }
        }

        for (missle in missiles) {
            if (missle[0] + MISSILE_LIFETIME < time) {
                missiles.remove(missle);
            } else {
                missle[1].draw(canvas);

                if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                    missle[1].update();
                }

                for (rock in rocks) {
                    if (dist(missle[1].pos, rock.pos) <= missle[1].radius + rock.radius) {
                        explosions.append(new Explosion(rock.pos));
                        rocks.remove(rock);
                        missiles.remove(missle);

                        // determine if big rock exploded
                        if (rock.radius == asteroid_info.radius) {
                            pos1 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos2 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));
                            pos3 = (rock.pos[0] + Random.randRange(-10, 10), rock.pos[1] + Random.randRange(-10, 10));

                            spawn_rock(pos1, false);
                            spawn_rock(pos2, false);
                            spawn_rock(pos3, false);
                        }

                        score += 1;

                        if (slowmo < MAX_SLOW_MO) {
                            slowmo = min(slowmo + SLOWMO_ADD_DELTA, MAX_SLOW_MO);
                        }

                        break;
                    }
                }
            }
        }

        for (explosion in explosions) {
            explosion.draw(canvas);

            if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
                explosion.update();
            }
        }

        if (slowmo_enabled == false || slowmo <= 0 || time % SLOW_MO_COEF == 0) {
            my_ship.update();
        }

        // draw score
        score_str = 'Score: ' + str(score);
        canvas.draw_text(score_str, (10, 20), 24, "White");

        // draw lives
        lives_str = 'Lives: ' + str(lives)
        canvas.draw_text(lives_str, (WIDTH - 100, 20), 24, "White")

        // draw slow-mo counter
        canvas.draw_polygon([
            SLOWMO_TOP_LEFT,
            (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1]),
            (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
            (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
            1, "Red");

        if (slowmo < MAX_SLOW_MO || time % 14 >= 7) {
            canvas.draw_polygon([
                SLOWMO_TOP_LEFT,
                (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1]),
                (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
                (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
                1, "Red", "Red")
        } else if (slowmo == MAX_SLOW_MO) {
            canvas.draw_text("Press E", (SLOWMO_TOP_LEFT[0] + 15, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT / 2 + 5), 20, "Red")
        }
    }
}