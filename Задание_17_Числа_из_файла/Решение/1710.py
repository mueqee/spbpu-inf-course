
f = open('1710.txt') 


a = [int(s) for s in f] 


sum_tri = []

maxc = [] 
for x in a:
    if (abs(x) % 100 == 42 and len(str(abs(x))) == 4):
        maxc.append(x)
maxc = max(maxc) 

for i in range(len(a) - 2):
    c = (abs(a[i])   % 100 == 42 and (len(str(abs(a[i]))) == 4)) + \
    (abs(a[i+1]) % 100 == 42 and (len(str(abs(a[i+1]))) == 4)) + \
    (abs(a[i+2]) % 100 == 42 and (len(str(abs(a[i+2]))) == 4))
    if c >= 2:
        if (a[i] + a[i+1] + a[i+2] > maxc):
            sum_tri.append(a[i] + a[i+1] + a[i+2])

print(len(sum_tri), max(sum_tri))
