"""
F=¬(w→(x≡y))∧(z→x)

- - - - F
- 0 1 0 1
0 - - 0 1
- 1 1 - 1
"""
print ('x y z w F')

for x in [0,1]:
    for y in [0,1]:
        for z in [0,1]:
            for w in [0,1]:
                if ((not ((not w) or (x==y))) and ((not z) or x)) == 1:
                    print(x,y,z,w,1)

                    """
                    Ответ: yxwz
                    """