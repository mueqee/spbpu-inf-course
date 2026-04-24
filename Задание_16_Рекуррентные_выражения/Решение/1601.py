"""
def F(n):
    if n <= 1:
        return 0
    if n > 1 and n % 2 != 0:
        return F(n - 1) + 3 * (n ** 2)
    if n > 1 and n % 2 == 0:
        return n//2 + F(n - 1) + 2
print(F(49))
"""

