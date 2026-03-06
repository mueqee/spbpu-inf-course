"""
Сколько существует семеричных пятизначных чисел,
содержащих в своей записи ровно одну цифру 6
и не содержащих идущих подряд одинаковых цифр?

Ответ: 3625
"""
from itertools import product

a= '0123456'
i= 0
for n in product(a, repeat=5):
	i+= n[0] !='0' and n.count('6') == 1 and all(x!= y for x, y in zip(n,n[1:]))
print(i)
