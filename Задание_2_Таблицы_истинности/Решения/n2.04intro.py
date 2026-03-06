"""
¬x∨y∨(¬z∧w)

- - - - F
0 1 0 0 0 
0 1 1 0 0 
1 1 1 0 0
"""
print('w x y z F')

for w in [0,1]:
    for x in [0,1]:
        for y in [0,1]:
            for z in [0,1]:
                if ((not x) or y or ((not z) and w)) == 0:
                    print(w,x,y,z,0)
                    """
                    Ответ: wxzy
                    """


                