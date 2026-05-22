# Задание 27: Анализ данных. Кластеризация

## 1. Общая информация о задании

- **Уровень сложности:** высокий (Часть 2)
- **Максимальный балл:** 2
- **Примерное время выполнения:** около 40 минут
- **Формат файла:** `.txt`, каждая строка — два числа `x y` через пробел (первая строка — заголовок)
- **Формат ответа:** четыре числа в двух строках (для файла A и файла B)

**Типичная структура ответа:**
```
int(Px_A × 10000)  int(Py_A × 10000)
int(Px_B × 10000)  int(Py_B × 10000)
```
где Px, Py — среднее арифметическое координат медоид всех кластеров.

---

Задания: [Задания N27. Анализ данных. уровень 1](https://ya.cc/9V8aCK) | [N27. Банк заданий](https://inf-ege.sdamgia.ru/problem?id=76130)  

---

## 2. Ключевые понятия

### Медоида vs Центроид

> **Медоида** — реальная точка из набора данных, для которой сумма расстояний до всех остальных точек кластера минимальна.
>
> **Центроид** — геометрический центр кластера (среднее арифметическое координат). Может не совпадать ни с одной точкой из файла.

В задании 27 нужен именно **медоида** которая является реальной точкой из данных

---

## Варианты методов решения

В 27 заданиях можно применять один из трёх алгоритмов для кластеризации:

[Кластеризация через уравнения прямых](https://future-step.ru/tutor/task-27-clust/)
[Кластеризация методом k-средних](https://future-step.ru/tutor/task-27-kmeans/)
[Кластеризация методом DBSCAN](https://future-step.ru/tutor/task-27-dbscan/)

также см. примеры применения: [Часть 1](https://future-step.ru/tutor/task-27-1/)| [Часть 2](https://future-step.ru/tutor/task-27-1/) | [Часть 3](https://future-step.ru/tutor/task-27-1/)

---

##  Пошаговый алгоритм решения

1. **Прочитать условие**, т.е сколько кластеров N, какая формула расстояния, что именно вывести
2. **Открыть файл в LibreOffice Calc** → выделить данные → вставить точечную диаграмму → определить форму кластеров и границы
3. **Выбрать метод** линейная граница → метод прямых; выпуклые кластеры → k-средних; серповидные / с выбросами → DBSCAN
4. **Считать данные**, запустить кластеризацию
5. **Проверить** количество и размеры кластеров должны совпадать с ожидаемым из диаграммы
6. **Найти медоиды** через функцию `get_medoid()`
7. **Вычислить и вывести** ответ по условию


---

## 3. Формула расстояния

### Евклидово расстояние (основное в 2025–2026)

```python
from math import dist
d = dist((x1, y1), (x2, y2))   # sqrt((x2-x1)^2 + (y2-y1)^2)
```

### Расстояние Чебышева (встречается в отдельных вариантах)

```python
d = max(abs(x2 - x1), abs(y2 - y1))
```

> Внимательно читать условие, там явно указана формула расстояния.

---

## 4. Считывание данных из файла

```python
with open('27A.txt') as f:
    next(f) # пропустить заголовок, также можно вручную удалить
    data = [list(map(float, s.split())) for s in f]
```

Если заголовка нет **убрать `next(f)`**.

Если разделитель запятая то добавить:

```python
data = [list(map(float, s.replace(',', '.').split())) for s in f]
```

---

## 5. Функция поиска медоиды

```python
from math import dist

def get_medoid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))
```

Или без `lambda` явный перебор:

```python
def get_medoid(cluster):
    best, best_sum = None, 10**18
    for p in cluster:
        s = sum(dist(p, q) for q in cluster)
        if s < best_sum:
            best_sum = s
            best = p
    return best
```

---

## 6. Три метода кластеризации

### Метод 1: Ручное разбиение по уравнению прямой (самый быстрый)

**Когда применять:** кластеры разделяются прямой линией (x < C или y < C), где C число

Визуализируем в LibreOffice Calc: данные → точечная диаграмма → визуально находим границу разреза

**Пример: 2 кластера, разделяются прямой x = 1:**

```python
from math import dist

def get_medoid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))

cluster_1, cluster_2 = [], []
with open('27A.txt') as f:
    next(f)
    for line in f:
        x, y = map(float, line.split())
        if x < 1:
            cluster_1.append((x, y))
        else:
            cluster_2.append((x, y))

medoids = [get_medoid(cluster_1), get_medoid(cluster_2)]
px = sum(x for x, y in medoids) / len(medoids)
py = sum(y for x, y in medoids) / len(medoids)
print(abs(int(px * 10_000)), abs(int(py * 10_000)))
```

**Пример: 3 кластера, два разреза:**

```python
clusters = [[], [], []]
with open('27B.txt') as f:
    next(f)
    for line in f:
        x, y = map(float, line.split())
        if y < 3:
            clusters[0].append((x, y))
        elif y > 7:
            clusters[1].append((x, y))
        else:
            clusters[2].append((x, y))

medoids = [get_medoid(cl) for cl in clusters]
px = sum(x for x, y in medoids) / len(medoids)
py = sum(y for x, y in medoids) / len(medoids)
print(abs(int(px * 10_000)), abs(int(py * 10_000)))
```

---

### Метод 2: k-средних с медоидами (универсальный для выпуклых кластеров)

**Когда применять:** кластеры нельзя разделить одной прямой, но они примерно круглые / выпуклые.

**Отличие от классического k-средних:** вместо геометрического центра используется **медоида** (реальная точка).

**Начальные точки** выбираются вручную по диаграмме — по одной из каждого видимого кластера. Это важно: случайная инициализация может дать неверный результат.

```python
from math import dist

def assign_clusters(data, centers):
    """Каждой точке — индекс ближайшего центра."""
    labels = []
    for p in data:
        distances = [dist(p, center) for center in centers]
        labels.append(distances.index(min(distances)))
    return labels

def update_centers(data, labels, k):
    """Пересчёт центров: медоида каждого кластера."""
    new_centers = []
    for i in range(k):
        cluster = [p for p, l in zip(data, labels) if l == i]
        medoid = min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))
        new_centers.append(medoid)
    return new_centers

def k_means(data, k, start_centers):
    centers = start_centers
    while True:
        labels = assign_clusters(data, centers)
        new_centers = update_centers(data, labels, k)
        if new_centers == centers:
            break
        centers = new_centers
    return labels, centers
```

**Полное решение:**

```python
from math import dist

def get_medoid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))

def assign_clusters(data, centers):
    return [min(range(len(centers)), key=lambda i: dist(p, centers[i])) for p in data]

def update_centers(data, labels, k):
    return [get_medoid([p for p, l in zip(data, labels) if l == i]) for i in range(k)]

def k_means(data, k, start_centers):
    centers = start_centers
    while True:
        labels = assign_clusters(data, centers)
        new_centers = update_centers(data, labels, k)
        if new_centers == centers:
            break
        centers = new_centers
    return labels, centers

with open('27A.txt') as f:
    next(f)
    data = [list(map(float, line.split())) for line in f]

# Начальные точки выбираем по диаграмме вручную!
labels, centers = k_means(data, 2, [[-9, -2], [-1, 15]])

px = sum(x for x, y in centers) / len(centers)
py = sum(y for x, y in centers) / len(centers)
print(abs(int(px * 10_000)), abs(int(py * 10_000)))
```

---

### Метод 3: DBSCAN (для сложных форм и выбросов)

**Когда применять:**
- Кластеры серповидной или другой нестандартной формы
- В данных есть выбросы (шумовые точки)
- Нет линейной разделяющей границы

**Единственный параметр `eps`** (радиус соседства). Подбирается по диаграмме: должен быть достаточно большим, чтобы объединить точки внутри кластера, но достаточно малым, чтобы не «слить» два кластера.

**Принцип:** берём точку → находим всех соседей в радиусе eps → добавляем в кластер → для каждого нового соседа снова ищем соседей → повторяем пока кластер растет

```python
from math import dist

def dbscan(data, eps):
    data = list(data)
    clusters = []
    while data:
        point = data.pop()
        cluster = [point]
        queue = [point]
        while queue:
            current = queue.pop(0)
            neighbors = [p for p in data if dist(current, p) < eps]
            cluster.extend(neighbors)
            queue.extend(neighbors)
            data[:] = [p for p in data if p not in neighbors]
        clusters.append(cluster)
    return clusters
```

**Полное решение:**

```python
from math import dist

def get_medoid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))

def dbscan(data, eps):
    data = list(data)
    clusters = []
    while data:
        point = data.pop()
        cluster = [point]
        queue = [point]
        while queue:
            current = queue.pop(0)
            neighbors = [p for p in data if dist(current, p) < eps]
            cluster.extend(neighbors)
            queue.extend(neighbors)
            data[:] = [p for p in data if p not in neighbors]
        clusters.append(cluster)
    return clusters

with open('27A.txt') as f:
    next(f)
    data = [tuple(map(float, line.split())) for line in f]

clusters = dbscan(data, eps=2)
print([len(cl) for cl in clusters])   # проверка числа и размеров кластеров

# Фильтрация выбросов (одиночных точек)
clusters = [cl for cl in clusters if len(cl) > 5]

medoids = [get_medoid(cl) for cl in clusters]
px = sum(x for x, y in medoids) / len(medoids)
py = sum(y for x, y in medoids) / len(medoids)
print(abs(int(px * 10_000)), abs(int(py * 10_000)))
```

**Подбор eps:** начать с 1–2, смотреть на `print([len(cl) for cl in clusters])`. Нужно получить `N` кластеров с примерно равным числом точек. Если кластеров слишком много — увеличить eps. Если один большой — уменьшить.

---

## 8. Типовые вычисления по медоидам

### Среднее арифметическое координат (Px, Py), самый частый вариант

```python
px = sum(x for x, y in medoids) / len(medoids)
py = sum(y for x, y in medoids) / len(medoids)
print(abs(int(px * 10000)), abs(int(py * 10000)))
```

### Расстояние между двумя медоидами

```python
d = dist(medoids[0], medoids[1])
print(int(d * 10000))
```

### Количество точек с x ≤ x_медоиды в кластере

```python
cx, cy = medoids[i]
count = sum(1 for x, y in clusters[i] if x <= cx)
```

### Количество точек внутри квадрата (сторона 2·r) вокруг медоиды

```python
cx, cy = medoids[i]
r = 1.0
count = sum(1 for x, y in clusters[i] if abs(x - cx) <= r and abs(y - cy) <= r)
```

### Расстояние по оси Y между медоидами двух кластеров

```python
dy = abs(medoids[i][1] - medoids[j][1])
print(int(dy * 10000))
```

---

## 9. Визуализация для проверки (модуль turtle)

Полезно при отладке, видно, правильно ли разбились кластеры:

```python
import turtle

def draw_clusters(data, labels):
    turtle.screensize(2000, 2000)
    turtle.tracer(0)
    scale = 50
    colors = ["#F76D47", "#A7D380", "#79CFD4", "#8A6FDF"]
    for point, label in zip(data, labels):
        turtle.teleport(point[0] * scale, point[1] * scale)
        turtle.dot(16, colors[label % len(colors)])
    turtle.update()
    turtle.done()
```

Вызов: `draw_clusters(data, labels)`, где `labels` это список индексов кластера для каждой точки.

---

## 10. Полный шаблон решения (DBSCAN)

```python
from math import dist

def get_medoid(cluster):
    return min(cluster, key=lambda p: sum(dist(p, q) for q in cluster))

def dbscan(data, eps):
    data = list(data)
    clusters = []
    while data:
        point = data.pop()
        cluster = [point]
        queue = [point]
        while queue:
            current = queue.pop(0)
            neighbors = [p for p in data if dist(current, p) < eps]
            cluster.extend(neighbors)
            queue.extend(neighbors)
            data[:] = [p for p in data if p not in neighbors]
        clusters.append(cluster)
    return clusters

def solve(filename, eps, min_size=5):
    with open(filename) as f:
        next(f)
        data = [tuple(map(float, s.split())) for s in f]
    clusters = dbscan(data, eps)
    clusters = [cl for cl in clusters if len(cl) >= min_size]
    print(f'{filename}: кластеры {[len(cl) for cl in clusters]}')  # проверка
    medoids = [get_medoid(cl) for cl in clusters]
    px = sum(x for x, y in medoids) / len(medoids)
    py = sum(y for x, y in medoids) / len(medoids)
    print(abs(int(px * 10_000)), abs(int(py * 10_000)))

solve('27A.txt', eps=2)
solve('27B.txt', eps=2)
```


---

## 12. Типичные ошибки

| Ошибка | Как избежать |
|:---|:---|
| Медоида = среднее координат (геометрический центр) | Медоида реальная точка с **минимальной суммой расстояний** |
| Неправильный `eps` в DBSCAN → неверное число кластеров | Проверить `print([len(cl) for cl in clusters])` перед подсчётом |
| Забыть убрать шум (одиночные точки-выбросы) | Фильтровать: `[cl for cl in clusters if len(cl) >= 5]` |
| Заголовок первой строки файла попал в данные | Добавить `next(f)` при считывании |
| `int()` vs `round()` | В условии «целую часть» → `int()`, не `round()` |
| Начальные точки k-средних выбраны случайно | Выбирать вручную по диаграмме — по одной из каждого кластера |
| Для серповидных кластеров использован k-средних | Серповидные / нестандартные формы → только DBSCAN |
| `abs()` вокруг `int()` не применён | Условие задачи: обычно нужно `abs(int(...))` — читать внимательно |

---

## 13. Файлы решений

| Файл | Метод | Описание |
|:---|:---|:---|
| `2701.py` | DBSCAN | Шаблон: DBSCAN + медоида + среднее Px/Py |
