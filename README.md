# Создание инлайнового PCRE для утилиты universalcodegrep
## Синтаксис

make_ucg_pattern.js SOURCE [SEPARATOR]


## Пример
```bash
$./make_ucg_pattern.js ../DangerousNodeJsFn.txt" ")|("
```

## Результат

### Было:

require('child_process')
require("child_process")

### Станет:

(require[(]+[\']+child_process[\']+[)]+)|(require[(]+[\"]+child_process[\"]+[)]+)

На выходе появится файл с результатом.

### Рекомендация по использованию (для windows)
```cmd
node make_ucg_pattern.js ../DangerousNodeJsFn.txt" ")|(" | clip
```
Тогда PCRE-строка помещается в буфер памяти. Далее просто CTRL+V в 

подготовленную команду:

```bash
$ ucg "<CTRL+V>" path/to/[file] [options]
```
![alt tag](https://raw.githubusercontent.com/feurjarx/ctf-tools/master/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA.PNG)
