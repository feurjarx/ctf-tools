# Обертка для анализатор исходников
## Установка
1. Установить **Universal Code Grep** (https://gvansickle.github.io/ucg/).
2. Установить **NodeJs** (https://nodejs.org/en/download/package-manager/). 
3. В корне **source-analysis** запустить установку сторонних зависимостей. Команда: 
```bash
$ npm i
```

## Использование
1. В каталог **signatures** поместить файлы, содержащие ключевые строки, и(-или) указать необходимый паттерн значением ключа **custom_pcre**.  
2. Открыть конфиг **config/analyse.json**, чтобы указать целевой каталог или файл (**target**), а также список используемых имен сигнатурных файлов.
```json
{
  "target": "/home/vagrant/skia",
  "signatures": [
    "DangerousNodeJsFn.txt"
   ],
  "custom_pcre": "test",
  "ucg_options": [
    "--word-regexp",
    "--column"
  ],
  "options": {
    "one_result_file": true
  }
}
```
3. Убедившись, что **ucg** успешно установлен и работает, запустить обертку командой:
```bash
$ node dist/analyse.js
```
## Опции
**ucg_options** - все доступные опции ucg (https://gvansickle.github.io/ucg/#command-line-options)
**options** - опции данной утилиты:
1. **one_result_file** - сохранять результат всегда в один файл (без подстановки timestamp в наименование файла) (default: false).
2. **non_displayed** - не отображать результаты в консоль.