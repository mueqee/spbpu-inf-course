"""
F = ((x∨y)→z)∨(y≡w)∨z

- - - - F
0 1 - - 0
1 - 1 0 0
- 1 1 0 0 
"""
print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ( ((not(x or y))or z) or (y==w) or z ) == 0:
                    print(x,y,z,w,0)

                    """
                    Ответ: wyxz
                    """