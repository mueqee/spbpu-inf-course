"""
¬(y→(x≡w))∧(z→x)

- - - - | F
- 1 1 - | 1
0 - - 0 | 1
- 0 1 0 | 1
"""
print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ( (not ((not y) or (x==w))) and ((not z) or x) ) == 1:
                    print(x,y,z,w,1)

                    """
                    Ответ: wxyz
                    """