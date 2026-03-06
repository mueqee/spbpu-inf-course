"""
(х→y)∨¬(w→z)

- - - - F
1 0 0 1 0
0 0 0 1 0
1 0 1 1 0
"""
print('w x y z F')

for w in [0,1]:
    for x in [0,1]:
        for y in [0,1]:
            for z in [0,1]:
                if (((not x )or y) or ( w and (not z))) == 0:
                    print(w,x,y,z,0)
                    """
                    Ответ: zywx
                    """


                