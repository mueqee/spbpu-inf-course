# Задание 27: Анализ данных. Кластеризация

## 1. Общая информация о задании

- **Уровень сложности:** высокий (Часть 2)
- **Максимальный балл:** 2
- **Примерное время выполнения:** около 40 минут
- **Формат файла:** `.txt`, каждая строка — два числа `x y` через пробел
- **Формат ответа:** четыре числа в двух строках (для файла A и файла B)

**Типичная структура ответа:**
```
A1 int(A2 × 10000)
B1 int(B2 × 10000)
```

---

Задания: [N27. Банк заданий](https://inf-ege.sdamgia.ru/problem?id=76130) | [Разборы alex-math.ru](https://alex-math.ru/gia/egei27/)

---

## 2. Суть задания

На плоскости заданы точки (звёзды, склады и т.п.). Нужно:

1. **Разбить** точки на `N` кластеров (задаётся в условии)
2. **Найти центроид** каждого кластера — точку внутри кластера, у которой **сумма расстояний** до всех остальных точек кластера **минимальна**
3. **Вычислить** требуемые величины (среднее координат центроидов, расстояния между ними и т.п.)

> Центроид — не среднее арифметическое координат! Это конкретная точка **из датасета** с минимальной суммой расстояний до остальных.

---

## 3. Формула расстояния

### Евклидово расстояние (основное в 2025–2026)

```python
from math import dist
d = dist((x1, y1), (x2, y2))   # sqrt((x2-x1)^2 + (y2-y1)^2)
```

### Расстояние Чебышева (встречается в нестандартных вариантах)

```python
d = max(abs(x2 - x1), abs(y2 - y1))
```

> Внимательно читать условие — там явно указана формула расстояния.

---

## 4. Считывание данных из файла

```python
with open('27A.txt') as f:
    next(f)                                     # пропустить заголовок, если он есть
    data = [list(map(float, s.split())) for s in f]
```

Если заголовка нет — убрать `next(f)`.

Если разделитель — запятая (встречается в старых вариантах):

```python
data = [list(map(float, s.replace(',', '.').split())) for s in f]
```

---

## 5. Два способа разбить на кластеры

### Способ 1: Ручное разбиение по границе (быстрее)

Визуализируем в Excel/LibreOffice (точечная диаграмма) и находим границу `x < 2` или `y > 3`:

```python
cluster1 = [p for p in data if p[0] < 2]      # x < 2
cluster2 = [p for p in data if p[0] >= 2]     # x >= 2
```

Для трёх кластеров — последовательно два разреза:

```python
cluster1 = [p for p in data if p[1] < -2.5]            # нижний
cluster2 = [p for p in data if p[1] >= -2.5 and p[0] < 3.5]
cluster3 = [p for p in data if p[1] >= -2.5 and p[0] >= 3.5]
```

### Способ 2: Автоматический DBSCAN (универсальный)

Алгоритм роста кластера: берём точку, находим всех соседей в радиусе `eps`, добавляем в кластер, рекурсивно расширяем.

```python
from math import dist

def dbscan(data, eps):
    data = list(data)          # делаем копию, будем изменять
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

clusters = dbscan(data, eps=1.9)
```

> `eps` подбираем так, чтобы количество кластеров совпало с `N` из условия. Обычно это чуть меньше минимального расстояния между кластерами. Типичные значения: `1.5`, `1.9`, `2.5`.

Фильтрация шума (точек-одиночек, если условие предполагает плотные кластеры):

```python
clusters = [cl for cl in clusters if len(cl) > 5]
```

---

## 6. Поиск центроида

```python
from math import dist

def centroid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))
```

Или без `min/lambda` — явный перебор:

```python
def centroid(cluster):
    best, best_sum = None, 10**18
    for p in cluster:
        s = sum(dist(p, q) for q in cluster)
        if s < best_sum:
            best_sum = s
            best = p
    return best

centroids = [centroid(cl) for cl in clusters]
```

---

## 7. Типовые вычисления по центроидам

### Среднее арифметическое координат (Px, Py)

```python
px = sum(x for x, y in centroids) / len(centroids)
py = sum(y for x, y in centroids) / len(centroids)
print(int(px * 10000), int(py * 10000))
```

### Расстояние между двумя центроидами

```python
from math import dist
d = dist(centroids[0], centroids[1])
print(int(d * 10000))
```

### Точки в кластере с x ≤ x_центроида

```python
cx, cy = centroids[i]
count = sum(1 for x, y in clusters[i] if x <= cx)
```

### Точки внутри квадрата со стороной 2*r вокруг центроида

```python
cx, cy = centroids[i]
r = 1.0
count = sum(1 for x, y in clusters[i] if abs(x - cx) <= r and abs(y - cy) <= r)
```

---

## 8. Полный шаблон решения

```python
from math import dist

def read_data(filename, skip_header=False):
    with open(filename) as f:
        if skip_header:
            next(f)
        return [list(map(float, s.split())) for s in f]

def dbscan(data, eps):
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
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))

# --- Файл A ---
dataA = read_data('27A.txt')
clustersA = dbscan(dataA, eps=1.9)
clustersA = [cl for cl in clustersA if len(cl) > 5]   # убрать шум
cA = [centroid(cl) for cl in clustersA]

px = sum(x for x, y in cA) / len(cA)
py = sum(y for x, y in cA) / len(cA)
print(int(px * 10000), int(py * 10000))

# --- Файл B ---
dataB = read_data('27B.txt')
clustersB = dbscan(dataB, eps=1.9)
clustersB = [cl for cl in clustersB if len(cl) > 5]
cB = [centroid(cl) for cl in clustersB]

px = sum(x for x, y in cB) / len(cB)
py = sum(y for x, y in cB) / len(cB)
print(int(px * 10000), int(py * 10000))
```

---

## 9. Пошаговый алгоритм решения на экзамене

1. **Прочитать условие**: сколько кластеров, как вычисляется расстояние, что именно вывести
2. **Открыть файл в LibreOffice Calc** → выделить данные → вставить точечную диаграмму → визуально определить границу кластеров
3. **Считать данные** в Python
4. **Разбить на кластеры** — ручным разрезом или DBSCAN
5. **Найти центроиды** через функцию `centroid()`
6. **Вычислить ответ** по условию задачи
7. **Промежуточный вывод**: `print([len(cl) for cl in clusters])` — убедиться, что количество и размеры кластеров правильные

---

## 10. Типичные ошибки

| Ошибка | Как избежать |
|:---|:---|
| Центроид = среднее арифметическое координат | Центроид — точка с **минимальной суммой расстояний**, не геометрический центр |
| Неправильный `eps` в DBSCAN → неверное число кластеров | Проверить `print([len(cl) for cl in clusters])` перед подсчётом ответа |
| Забыть убрать шум (одиночные точки) | Фильтровать: `[cl for cl in clusters if len(cl) > 5]` |
| Заголовок первой строки файла попал в данные | Добавить `next(f)` при считывании или проверить первую строку файла |
| `int()` вместо `round()` даёт неверный результат | В условии обычно написано «целую часть» — это именно `int()`, не `round()` |
| Разделитель дробной части — запятая вместо точки | Делать `.replace(',', '.')` перед `float()` |
| DBSCAN медленно работает на больших файлах | Попробовать ручной разрез по диаграмме — это быстрее |

---

## 11. Файлы решений

| Файл | Описание |
|:---|:---|
| `2701.py` | Шаблон: DBSCAN + центроид + среднее Px/Py |
