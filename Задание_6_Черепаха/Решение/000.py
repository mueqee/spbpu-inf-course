from turtle import *



k = 15
tracer(0)
left(90)

screensize(2000,2000)
tracer(0)
pendown()

for _ in range(2):
    forward(5 * k)
    right(90)
    forward(11 * k)
    right(90)

penup()

backward(4 * k)
right(90)
forward(6 * k)
left(90)

pendown()
for _ in range(2):
    forward(42 * k)
    right(90)
    forward(63 * k)
    right(90)

#for i in range(15):
#    for j in range(20):
#        forward(40 * k)
#        right(90)
#    left(90)

penup()
for x in range(-100, 100):
    for y in range(-100, 100):
        setpos(x * k, y * k)
        dot()
done()