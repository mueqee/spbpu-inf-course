"""
ФИПИ: Задание 27. Анализ данных. Кластеризация

Учёный решил провести кластеризацию полученных точек, 
являющихся изображениями звёзд, то есть разбить их 
множество на N непересекающихся непустых подмножеств (кластеров).

Центр кластера (центроид) — это одна из точек кластера,
сумма расстояний от которой до всех остальных точек кластера минимальна.

Расстояние между двумя точками вычисляется по формуле:
d = sqrt((x2 - x1)^2 + (y2 - y1)^2)

Для каждого файла определите координаты центра каждого кластера,
затем вычислите два числа:
  Px — среднее арифметическое абсцисс центров кластеров,
  Py — среднее арифметическое ординат центров кластеров.

В ответе запишите четыре числа:
  в первой строке — int(Px × 10000), int(Py × 10000) для файла A
  во второй строке — аналогичные данные для файла B
"""

from math import dist


def read_data(filename, skip_header=False):
    with open(filename) as f:
        if skip_header:
            next(f)
        return [list(map(float, s.split())) for s in f]


def dbscan(data, eps):
    """Алгоритм роста кластеров: точка попадает в кластер,
    если находится на расстоянии < eps от любой точки кластера."""
    data = list(data)
    clusters = []
    while data:
        point = data.pop()
        cluster = [point]
        queue = [point]
        while queue:
            cur = queue.pop(0)
            neighbors = [p for p in data if dist(cur, p) < eps]
            cluster.extend(neighbors)
            queue.extend(neighbors)
            data[:] = [p for p in data if p not in neighbors]
        clusters.append(cluster)
    return clusters


def centroid(cluster):
    """Точка кластера с минимальной суммой расстояний до остальных."""
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))


def solve(filename, eps=1.9, min_cluster_size=5, skip_header=False):
    data = read_data(filename, skip_header)
    clusters = dbscan(data, eps)
    clusters = [cl for cl in clusters if len(cl) >= min_cluster_size]

    print(f'Кластеры ({filename}):', [len(cl) for cl in clusters])  # для проверки

    cen = [centroid(cl) for cl in clusters]
    px = sum(x for x, y in cen) / len(cen)
    py = sum(y for x, y in cen) / len(cen)
    print(int(px * 10000), int(py * 10000))


# --- запускаем для обоих файлов ---
solve('27A.txt', eps=1.9)
solve('27B.txt', eps=1.9)
