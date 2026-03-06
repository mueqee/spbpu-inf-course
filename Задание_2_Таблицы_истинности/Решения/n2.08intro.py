"""
F: (x∨y)∧¬(y≡z)∧¬w

- - - -  F
1 - 1 -  1
0 1 - 0  1
- 1 1 0  1
"""
print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ( (x or y) and (not(y==z)) and (not w) ) == 1:
                    print(x,y,z,w,1)

                    """
                    Ответ: zyxw
                    """