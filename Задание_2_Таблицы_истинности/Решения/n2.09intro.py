"""
(x∧¬y)∨(y≡z)∨w

- - - -  F
- - 1 -  0
0 0 0 1  0 
1 0 - 1  0
"""
print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ( (x and (not y)) or (y==z) or w ) == 0:
                    print(x,y,z,w,0)

                    """
                    Ответ: xwzy
                    """