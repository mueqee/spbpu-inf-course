from turtle import *

left(90)
k = 30

screensize(2000,2000)
tracer(0)
pendown()

for _ in range(2025):
    forward(10 * k)
    right(90)
    forward(5 * k)
    right(90)

penup()

forward(7 * k)
right(120)

pendown()

for _ in range(6):
    forward(5 * k)
    right(120)

penup()

for x in range(-50, 50):
    for y in range(-50, 50):
        setpos(x * k, y * k)
        dot()
done()