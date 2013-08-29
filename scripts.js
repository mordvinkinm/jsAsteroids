import simplegui
import math
import random

# constants for user interface
WIDTH = 800
HEIGHT = 600
SLOWMO_BAR_HEIGHT = 20
SLOWMO_TOP_LEFT = (12, 30)

# game constants
MAX_VEL = 7
ACCELERATION_COEF = 0.5
FRICTION_COEF = 0.05
TIME_BETWEEN_SHOOTING = 10
MISSLE_LIFETIME = 30
MISSLE_SPEED = 15
ROCK_VEL_MULTIPLIER = 3
INITIAL_LIVES = 3
RESPAWN_INVULNERABILITY = 200

SLOW_MO_COEF = 3
MAX_SLOW_MO = 100
SLOWMO_ADD_DELTA = 5
SLOWMO_SUB_DELTA = 0.5

# globals for UI
    score = 0
lives = INITIAL_LIVES
time = 0
game_over = False
slowmo = 0
slowmo_enabled = False

class ImageInfo:
    def __init__(self, center, size, radius = 0, lifespan = None, animated = False):
self.center = center
self.size = size
self.radius = radius
if lifespan:
self.lifespan = lifespan
else:
self.lifespan = float('inf')
self.animated = animated

def get_center(self):
return self.center

def get_size(self):
return self.size

def get_radius(self):
return self.radius

def get_lifespan(self):
return self.lifespan

def get_animated(self):
return self.animated


# debris images - debris1_brown.png, debris2_brown.png, debris3_brown.png, debris4_brown.png
#                 debris1_blue.png, debris2_blue.png, debris3_blue.png, debris4_blue.png, debris_blend.png
debris_info = ImageInfo([320, 240], [640, 480])
debris_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/debris2_blue.png")

# nebula images - nebula_brown.png, nebula_blue.png
nebula_info = ImageInfo([400, 300], [800, 600])
nebula_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/nebula_blue.png")

# splash image
splash_info = ImageInfo([200, 150], [400, 300])
splash_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/splash.png")

# ship image
ship_info = ImageInfo([45, 45], [90, 90], 35)
ship_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/double_ship.png")

# missile image - shot1.png, shot2.png, shot3.png
missile_info = ImageInfo([5,5], [10, 10], 3, 50)
missile_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/shot2.png")

# asteroid images - asteroid_blue.png, asteroid_brown.png, asteroid_blend.png
asteroid_info = ImageInfo([45, 45], [90, 90], 40)
asteroid_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blue.png")

# animated explosion - explosion_orange.png, explosion_blue.png, explosion_blue2.png, explosion_alpha.png
explosion_info = ImageInfo([64, 64], [128, 128], 17, 24, True)
explosion_image = simplegui.load_image("http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/explosion_alpha.png")

# sound assets purchased from sounddogs.com, please do not redistribute
soundtrack = simplegui.load_sound("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3")
missile_sound = simplegui.load_sound("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/missile.mp3")
missile_sound.set_volume(.5)
ship_thrust_sound = simplegui.load_sound("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3")
explosion_sound = simplegui.load_sound("http://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3")

# helper functions to handle transformations
def angle_to_vector(ang, r = 1):
return [r * math.cos(ang), r * math.sin(ang)]

def dist(p, q = (0, 0)):
return math.sqrt((p[0] - q[0]) ** 2+(p[1] - q[1]) ** 2)

# storage for sprites
    missles = []
rocks = []
explosions = []

# Ship class
class Ship:
    def __init__(self, pos, vel, angle, image, info):
self.pos = [pos[0],pos[1]]
self.vel = [vel[0],vel[1]]
self.thrust = False
self.shooting = False
self.angle = angle
self.angle_vel = 0
self.image = image
self.image_center = info.get_center()
self.image_size = info.get_size()
self.radius = info.get_radius()
self.last_shooting = 0
self.invulnerability = RESPAWN_INVULNERABILITY

def draw(self,canvas):
if (self.thrust == True):
ship_thrust_sound.play()
sprite_center = (ship_info.get_center()[0] + ship_info.get_size()[0], ship_info.get_center()[1])
canvas.draw_image(ship_image, sprite_center, ship_info.get_size(), self.pos, ship_info.get_size(), self.angle)
else:
ship_thrust_sound.rewind()
canvas.draw_image(ship_image, ship_info.get_center(), ship_info.get_size(), self.pos, ship_info.get_size(), self.angle)

if (self.invulnerability > 0 and self.invulnerability % 5 == 0):
canvas.draw_circle(self.pos, ship_info.get_radius() + 10.0, 1, "White")

def destroy(self):
global lives, game_over
lives -= 1

explosions.append(Explosion(self.pos))

if (lives <= 0):
game_over = True
ship_thrust_sound.rewind()
else:
self.invulnerability = RESPAWN_INVULNERABILITY


def check_collision(self):
for rock in rocks:
dst = dist(self.pos, rock.pos)
if (dst <= self.radius + rock.radius):
if (self.invulnerability <= 0):
self.destroy()
rocks.remove(rock)

def get_speed(self):
return math.sqrt(math.pow(self.vel[0], 2.0) + math.pow(self.vel[1], 2.0))

def update(self):
global time

if (self.invulnerability > 0):
self.invulnerability -= 1

self.angle = self.angle + self.angle_vel
while (self.angle > 2 * math.pi):
self.angle -= 2 * math.pi
while (self.angle < 0):
self.angle += 2 * math.pi

acceleration = (0, 0)
if (self.thrust == True):
acceleration = angle_to_vector(self.angle)
acceleration[0] *= ACCELERATION_COEF
acceleration[1] *= ACCELERATION_COEF

friction = (self.vel[0] * FRICTION_COEF, self.vel[1] * FRICTION_COEF)

if (dist(self.vel) <= MAX_VEL):
self.vel[0] += acceleration[0]
self.vel[1] += acceleration[1]

self.vel[0] -= friction[0]
self.vel[1] -= friction[1]

self.pos[0] += self.vel[0]
self.pos[1] += self.vel[1]

# cyclic space
if (self.pos[0] > WIDTH):
self.pos[0] = 0
elif (self.pos[0] < 0):
self.pos[0] = WIDTH

if (self.pos[1] > HEIGHT):
self.pos[1] = 0
elif (self.pos[1] < 0):
self.pos[1] = HEIGHT

if (self.shooting == True and (time - self.last_shooting > TIME_BETWEEN_SHOOTING)):
missle_vector = angle_to_vector(self.angle, MISSLE_SPEED + self.get_speed())

# setting missle position
missle_position = list(self.pos)
ship_size = ship_info.get_radius() + 1.0
ship_size_vect = angle_to_vector(self.angle, ship_size)
missle_position[0] += ship_size_vect[0]
missle_position[1] += ship_size_vect[1]

item = (time, Sprite(missle_position, missle_vector, self.angle, 0, missile_image, missile_info, missile_sound))
missles.append(item)

self.last_shooting = time

self.check_collision()

# Sprite class
class Sprite:
    def __init__(self, pos, vel, ang, ang_vel, image, info, sound = None, cyclic = False, actual_size = (-1, -1), actual_radius = -1):
self.pos = [pos[0],pos[1]]
self.vel = [vel[0],vel[1]]
self.angle = ang
self.angle_vel = ang_vel
self.image = image
self.image_center = info.get_center()
self.image_size = info.get_size()
if (actual_size == (-1, -1)):
self.actual_size = info.get_size()
else:
self.actual_size = actual_size

if (actual_radius == -1):
self.radius = info.get_radius()
else:
self.radius = actual_radius

self.lifespan = info.get_lifespan()
self.animated = info.get_animated()
self.age = 0
self.cyclic = cyclic
if sound:
sound.rewind()
sound.play()

def draw(self, canvas):
if (self.animated == True):
sprite_center = (self.image_center[0] + self.age * self.image_size[0], self.image_center[1])
canvas.draw_image(self.image, sprite_center, self.image_size, self.pos, self.actual_size, self.angle)
else:
canvas.draw_image(self.image, self.image_center, self.image_size, self.pos, self.actual_size, self.angle)

def update(self):
if (self.age > self.lifespan):
self.destroy()

self.age += 1

self.pos[0] += self.vel[0]
self.pos[1] += self.vel[1]

if (self.cyclic == True):
if (self.pos[0] > WIDTH):
self.pos[0] = 0
elif (self.pos[0] < 0):
self.pos[0] = WIDTH

if (self.pos[1] > HEIGHT):
self.pos[1] = 0
elif (self.pos[1] < 0):
self.pos[1] = HEIGHT

class Explosion(Sprite):
def __init__(self, pos):
explosion_sound.rewind()
explosion_sound.play()
Sprite.__init__(self, pos, (0, 0), 0, 0, explosion_image, explosion_info, None, False)

def destroy(self):
explosions.remove(self)

def draw(canvas):
global time, score, game_over, slowmo, slowmo_enabled

if (slowmo_enabled == True):
slowmo = max(slowmo - SLOWMO_SUB_DELTA, 0)
if (slowmo == 0):
slowmo_enabled = False

# animiate background
time += 1
center = debris_info.get_center()
size = debris_info.get_size()
wtime = (time / 8) % center[0]
canvas.draw_image(nebula_image, nebula_info.get_center(), nebula_info.get_size(), [WIDTH / 2, HEIGHT / 2], [WIDTH, HEIGHT])
canvas.draw_image(debris_image, [center[0] - wtime, center[1]], [size[0] - 2 * wtime, size[1]],
    [WIDTH / 2 + 1.25 * wtime, HEIGHT / 2], [WIDTH - 2.5 * wtime, HEIGHT])
#canvas.draw_image(debris_image, [size[0] - wtime, center[1]], [2 * wtime, size[1]], [1.25 * wtime, HEIGHT / 2], [2.5 * wtime, HEIGHT])

if (game_over == True):
canvas.draw_text("GAME OVER (Click to continue)", (150, HEIGHT / 2), 40, "Red")
canvas.draw_text("Score: " + str(score), (370, HEIGHT / 2 + 40), 30, "Red")
return

# draw ship and sprites
my_ship.draw(canvas)

for rock in rocks:
rock.draw(canvas)

if (slowmo_enabled == False or slowmo <= 0 or time % SLOW_MO_COEF == 0):
rock.update()

for missle in missles:
if (missle[0] + MISSLE_LIFETIME < time):
missles.remove(missle)
else:
missle[1].draw(canvas)

if (slowmo_enabled == False or slowmo <= 0 or time % SLOW_MO_COEF == 0):
missle[1].update()

for rock in rocks:
if (dist(missle[1].pos, rock.pos) <= missle[1].radius + rock.radius):
explosions.append(Explosion(rock.pos))
rocks.remove(rock)
missles.remove(missle)

# determine if big rock exploded
if (rock.radius == asteroid_info.get_radius()):
pos1 = (rock.pos[0] + random.randrange(-10, 10), rock.pos[1] + random.randrange(-10, 10))
pos2 = (rock.pos[0] + random.randrange(-10, 10), rock.pos[1] + random.randrange(-10, 10))
pos3 = (rock.pos[0] + random.randrange(-10, 10), rock.pos[1] + random.randrange(-10, 10))

spawn_rock(pos1, False)
spawn_rock(pos2, False)
spawn_rock(pos3, False)

score += 1

if (slowmo < MAX_SLOW_MO):
slowmo = min(slowmo + SLOWMO_ADD_DELTA, MAX_SLOW_MO)

break

for explosion in explosions:
explosion.draw(canvas)

if (slowmo_enabled == False or slowmo <= 0 or time % SLOW_MO_COEF == 0):
explosion.update()

if (slowmo_enabled == False or slowmo <= 0 or time % SLOW_MO_COEF == 0):
my_ship.update()

# draw score
score_str = 'Score: ' + str(score)
canvas.draw_text(score_str, (10, 20), 24, "White")

# draw lives
lives_str = 'Lives: ' + str(lives)
canvas.draw_text(lives_str, (WIDTH - 100, 20), 24, "White")

# draw slow-mo counter
canvas.draw_polygon([
    SLOWMO_TOP_LEFT,
    (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1]),
    (SLOWMO_TOP_LEFT[0] + MAX_SLOW_MO, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
    (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
    1, "Red")

if (slowmo < MAX_SLOW_MO or time % 14 >= 7):
canvas.draw_polygon([
    SLOWMO_TOP_LEFT,
    (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1]),
    (SLOWMO_TOP_LEFT[0] + slowmo, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT),
    (SLOWMO_TOP_LEFT[0], SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT)],
    1, "Red", "Red")
elif (slowmo == MAX_SLOW_MO):
canvas.draw_text("Press E", (SLOWMO_TOP_LEFT[0] + 15, SLOWMO_TOP_LEFT[1] + SLOWMO_BAR_HEIGHT / 2 + 5), 20, "Red")

# timer handler that spawns a rock
def spawn_rock(rock_pos = (random.randrange(0, WIDTH), random.randrange(0, HEIGHT)), large = True):
global rocks

if (random.randrange(0, 100) % 2 == 0):
mul1 = ROCK_VEL_MULTIPLIER
else:
mul1 = -ROCK_VEL_MULTIPLIER
if (random.randrange(0, 100) % 2 == 0):
mul2 = ROCK_VEL_MULTIPLIER
else:
mul2 = -ROCK_VEL_MULTIPLIER

if (large == True):
rocks.append(Sprite(rock_pos, (random.random() * mul1, random.random() * mul2), math.pi, 0, asteroid_image, asteroid_info, None, True))
else:
rocks.append(Sprite(rock_pos, (random.random() * mul1, random.random() * mul2), math.pi, 0, asteroid_image, asteroid_info, None, True, (45, 45), 20))

def on_key_down(key):
global slowmo_enabled

if (key == simplegui.KEY_MAP["up"]):
my_ship.thrust = True
elif (key == simplegui.KEY_MAP["down"]):
# insert stop code there
pass
elif (key == simplegui.KEY_MAP["left"]):
my_ship.angle_vel = -math.pi * 0.03
elif (key == simplegui.KEY_MAP["right"]):
my_ship.angle_vel = math.pi * 0.03
elif (key == simplegui.KEY_MAP["space"]):
my_ship.shooting = True
elif (key == simplegui.KEY_MAP["e"]):
if (slowmo > 0):
if (slowmo_enabled == True):
slowmo_enabled = False
else:
slowmo_enabled = True

def on_key_up(key):
if (key == simplegui.KEY_MAP["up"]):
my_ship.thrust = False
elif (key == simplegui.KEY_MAP["down"]):
# insert stop code there
pass
elif (key == simplegui.KEY_MAP["left"]):
my_ship.angle_vel = 0
elif (key == simplegui.KEY_MAP["right"]):
my_ship.angle_vel = 0
elif (key == simplegui.KEY_MAP["space"]):
my_ship.shooting = False

def on_click(position):
global game_over, score, lives, rocks, missles, explosions, my_ship

if (game_over == True):
game_over = False
score = 0
lives = INITIAL_LIVES

respawn()

def respawn():
global my_ship, rocks, missles, explosions, slowmo, slowmo_enabled

my_ship = Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_image, ship_info)
my_ship.angle = random.random() * math.pi
rocks = []
missles = []
explosions = []

slowmo_enabled = False
slowmo = 0

# initialize frame
frame = simplegui.create_frame("Asteroids", WIDTH, HEIGHT)

# initialize first respawn
respawn()

# register handlers
frame.set_draw_handler(draw)
frame.set_keydown_handler(on_key_down)
frame.set_keyup_handler(on_key_up)
frame.set_mouseclick_handler(on_click)

timer = simplegui.create_timer(2000.0, spawn_rock)

# get things rolling
timer.start()
frame.start()

soundtrack.play()
