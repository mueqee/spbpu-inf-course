def sum_2max(nadoske):
    b = sorted(nadoske)
    return b[:-2] + [b[-2] + b[-1]]

def spisok(s):
    return list(range(1, s + 1))

print(spisok(10))

#print(sum_2max([1, 2, 3, 4, 5]))