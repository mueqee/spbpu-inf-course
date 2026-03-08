# Задание 22: Вычислительные процессы

## Общая информация

- **Тема:** параллельное и последовательное выполнение процессов, минимальное время завершения всей совокупности работ.
- **Формат данных:** таблица (файл `.ods` / `.xlsx`) с колонками: ID процесса, время выполнения (мс), ID процессов-предшественников (0 - если независимый).
- **Ответ:** минимальное время завершения всех процессов при оптимальном расписании.
- **Балл:** 1. **Время:** 8 мин.

---

## Правила

- Процессы **не приостанавливаются** - начавшийся процесс выполняется до конца.
- **Независимые** процессы (нет предшественников) могут выполняться **параллельно**.
- Если процесс B зависит от процесса A, то B **не может начаться раньше**, чем завершится A.
- Один процесс может зависеть от **нескольких** - тогда он стартует после завершения **всех** своих предшественников.

---

Задания: N22.[ Параллельные процессы](https://ya.cc/8vSL2L)

---

## Идея решения

1. **Построить граф зависимостей**: ребро A → B означает «A должен завершиться до старта B».
2. Для каждого процесса вычислить **время начала** = максимум по всем временам завершения предшественников.
3. **Время завершения** процесса = время начала + его длительность.
4. **Ответ** = максимум времён завершения среди всех процессов.

Этот метод называется **нахождением критического пути** (метод CPM).

---
## Алгоритм по шагам. ЧЕРЕЗ ВПР
Задание: <br>
<img width="397" height="625" alt="image" src="https://github.com/user-attachments/assets/d277b211-ae1d-43a3-a7cd-92a465a1a955" /> <br>
Решение:
  1. Для дальнейшего удобства переименуем заголовки в "**ID**"	"**Время**"	"**ID  влияющих**"   <img width="295" height="437" alt="image" src="https://github.com/user-attachments/assets/c52339d6-403e-432a-832b-96de8a1a4372" /> <br>

2. Распределяем ID влияющих на несколько столбцов (1 ID = 1 столбец) с помощью инструмента "**Текст по столбцам...**" во вкладке **Данные** <img width="829" height="792" alt="Frame 1(1)" src="https://github.com/user-attachments/assets/d6ae00d5-efa0-4074-94a6-d10a2ed7a351" /> <img width="800" height="851" alt="Frame 2" src="https://github.com/user-attachments/assets/9bcaf48c-173e-4097-91d3-f885be522144" />  <br>
 
3. Выделить цветом столько же столбцов, сколько и id влияющих, назвать "**Время влияющих**". Назвать "**Начало**" и "**Конец**" <img width="1018" height="577" alt="image" src="https://github.com/user-attachments/assets/50991997-01db-4020-9586-b7d084a23500" /> <br>

  4. В ячейку **Начало** 1-го процесса прописываем формулу **=МАКС(время влияющих)+1** <img width="1056" height="256" alt="image" src="https://github.com/user-attachments/assets/925ce11a-9118-49b3-9177-fffd898de8d5" /> <br>
  5. В ячейку **Конец** 1-го процесса прописываем формулу **= Ячейка"Начало" + Ячейка"Время" - 1** <img width="1022" height="198" alt="image" src="https://github.com/user-attachments/assets/dfc4f031-fa72-41b1-9d44-f800f47e2154" /> <br>
  6. Растягиваем ячейки "**Начало**" и "**Конец**" на весь столбец
<img width="1022" height="582" alt="image" src="https://github.com/user-attachments/assets/9f9d9fe3-4b03-4c07-b073-3213158764ab" /> <br>
  **Проверка**: в столбце **Начало** все значения должны быть **1**, в столбце **Конец** такие же, как и в столбце **Время** <img width="1043" height="593" alt="Frame 3" src="https://github.com/user-attachments/assets/4d9b8c10-75e5-44b1-aca6-161701ea304d" /> <br>
  7.  В ячейке "**Время влияющих**" прописываем формулу ВПР, которая будет выглядеть как <br> **=ВПР(ячейка с ID влияющего процесса; все столбцы таблицы + F4 для $(закрепление значений); номер столбца "Конец"; 0)** <img width="1061" height="159" alt="image" src="https://github.com/user-attachments/assets/d9dffecd-563d-4918-9586-ca0627a2c22a" /> <br>
 **ВАЖНО!**: <br>
  - **первым** значением выбираем **ячейку** нужного процесса из ID влияющих <br>
  - ставить после каждого значения "**;**" и пробел,<br>
  - **вторым** значением - выделять таблицу через выделение столбцов (тянуть по буквам наверху стобцов),<br>
  - фиксировать таблицу через **F4** чтобы выл вид $A$J, где A и J это первый и последний столбцы таблицы,<br>
  - **третим** значением в впр писать **номер** последнего столбца **цифрой**, например, номер столбца J это 10,<br>
  - **четвертым** значением писать **0** (отвечает за поиск только полного совпадения)<br><br>
Результат должен быть такой как на скрине ниже, ошибка из-за ссылки на несуществующий индекс ID **0** <img width="1061" height="641" alt="image" src="https://github.com/user-attachments/assets/b55ddbd2-2b5b-4278-ab75-b3e724e3e69d" />
9. Добавляем **0** в столбец **ID**, ошибка пропала <img width="1061" height="641" alt="image" src="https://github.com/user-attachments/assets/479a74a5-3ea7-405a-af21-ad66e7248852" />
<br>

10. Копируем формулу на все остальные ячейки из **Время влияющих** <img width="1077" height="641" alt="image" src="https://github.com/user-attachments/assets/410be25c-4128-4e2b-b869-c1db46d04d99" />
<br>

11. Результат <img width="1077" height="641" alt="image" src="https://github.com/user-attachments/assets/20ca7dab-78f2-498c-99ac-a3c695433772" />
<br>

12. Делаем замену всех пустых пространств в столбцах **ID влияющих** на **0** <img width="1313" height="693" alt="Frame 4" src="https://github.com/user-attachments/assets/b1f21aef-804d-4dba-a16b-faf5ad78b684" /> <img width="1042" height="619" alt="Frame 5" src="https://github.com/user-attachments/assets/779ed0cb-518d-408a-bda6-53ec702d9219" /> <br>

13. Выводим максимальное время через формулу **МАКС** по столбцу **Конец** <img width="1337" height="613" alt="image" src="https://github.com/user-attachments/assets/da9ba172-60d8-4593-a3df-1d79b9d611de" /> <br>

14. Результат: **51**




---
## Алгоритм по шагам. ГРАФИЧЕСКОЕ РЕШЕНИЕ
Задание: <br>
<img width="397" height="625" alt="image" src="https://github.com/user-attachments/assets/d277b211-ae1d-43a3-a7cd-92a465a1a955" /> <br>
Решение:
  1. Для дальнейшего удобства переименуем заголовки в ID	Время	ID  влияющих и расставим время (начало с 1, не как в изображении) <br>  <img width="279" height="21" alt="image" src="https://github.com/user-attachments/assets/579a7e34-096e-4f28-b905-00ac7316ae77" /> <br>
<img width="1178" height="416" alt="image" src="https://github.com/user-attachments/assets/cdba0a3a-8aad-406e-a8b5-8efcb9edb4db" />
  
  2. Закрашиваем столько клеток, сколько указано в стобце В. Если в задание требуется посчитать, добавляем счетчик (1 в закрашенную ячейку)<br>
<img width="659" height="141" alt="image" src="https://github.com/user-attachments/assets/55e5a23d-4b00-4cae-82ef-f9b8accc7c17" /> <br>
 
  3. Так как влияющих процессов нет, первые два процесса будут параллельными <br>
<img width="659" height="141" alt="image" src="https://github.com/user-attachments/assets/a69ff204-c3f8-4670-b8ac-3f13868a07f6" /> <br>
 
  4. На 3 процесс влияют процессы 1 и 2, поэтому они будут последовательными (3 начнется тогда когда закончится 1 и 2) <br>
<img width="875" height="169" alt="image" src="https://github.com/user-attachments/assets/8959efd5-c5f7-4efb-875b-9190b0dfb121" /> <br>
 
  5. Последовательно заполняем остальные процессы
  <img width="1160" height="302" alt="image" src="https://github.com/user-attachments/assets/0e960d56-fc39-4244-96ae-a390f8d9aa2c" />

<img width="1160" height="302" alt="image" src="https://github.com/user-attachments/assets/9d0390da-906f-4366-b041-54f00207e6e7" />
<img width="1160" height="302" alt="image" src="https://github.com/user-attachments/assets/5d690331-e081-486f-be06-980e2fe3b4cb" />
<img width="1160" height="302" alt="image" src="https://github.com/user-attachments/assets/09229cfa-e124-4e5c-92ec-da564dc3f0e8" />
<img width="1160" height="302" alt="image" src="https://github.com/user-attachments/assets/b06a475d-746f-45d6-8994-0fe97b5e0ff4" />
<img width="1736" height="423" alt="image" src="https://github.com/user-attachments/assets/e0e12f74-5860-4075-86fa-16b298807a17" />

6. Ответом будет последняя число, под которым закрашена клетка
<img width="1736" height="437" alt="image" src="https://github.com/user-attachments/assets/c4f627c7-644e-49e8-8c56-00b1646334bd" />




   


---

## Типичные ошибки

| Ошибка | Как избежать |
|:---|:---|
| Забыть, что процесс ждёт **всех** предшественников | Брать `max`, а не `sum` времён завершения |
| Считать, что независимые идут последовательно | Независимые процессы стартуют одновременно в момент 0 |
| Неправильный топологический порядок | Использовать рекурсию или очередь (BFS по источникам) |

---

*Материалы будут дополняться.*
