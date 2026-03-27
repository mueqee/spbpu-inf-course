from turtle import *

left(90)
k = 30

screensize(2000,2000)
tracer(0)
pendown()

for _ in range(2):
    forward(25 * k)
    left(270)
    forward(17 * k)
    right(90)

penup()

forward(12 * k)
right(90)
forward(9 * k)
left(90)

pendown()

for _ in range(2):
    forward(19 * k)
    right(90)
    forward(11 * k)
    right(90)

penup()

for x in range(-50, 50):
    for y in range(-50, 50):
        setpos(x * k, y * k)
        dot()
done()