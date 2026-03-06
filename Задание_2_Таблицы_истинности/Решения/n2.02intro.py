"""

F=(y→x)∧¬z∧w

- - - - F
1 0 - - 1
1 1 - - 1
- 1 1 - 1

"""

print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ( ((not y) or x) and (not z) and w ) == 1:
                    print(x,y,z,w,1)



# - - - -
# - x - -
# w - - -
# - - y -
# - - - z

