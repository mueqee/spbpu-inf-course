print ('x y z w f')
for x in range(0,2):
    for y in range(0,2):
        for z in range(0,2):
            for w in range(0,2):
                if ( (x and ((not w) or y)) == 1 ) == 0:
                    print(x,y,z,w, 0)
                else:
                    print(x,y,z,w,1)
