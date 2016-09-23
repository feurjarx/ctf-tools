# Обертка для анализатор исходников
## Установка
1) Установить <b>Universal Code Grep</b> (https://gvansickle.github.io/ucg/).
2) Установить <b>NodeJs</b> (https://nodejs.org/en/download/package-manager/). 
3) В корне source-analysis запустить установку сторонних зависимостей. Команда: 
```bash
$ npm i
```

## Использование
1) В каталог signatures поместить файлы со строками ключевых строк
2) Открыть конфиг <b>config/analyse.json</b>, чтобы указать целевой каталог или файл (target), а также список используемых имен сигнатурных файлов.
```json
{
  "target": "C:\\public\\ctf-tools\\genpasswd",
  "signatures": [
    "DangerousNodeJsFn.txt",
    "DangerousPerlFn.txt"
  ]
}
```
3) Убедившись, что ucg успешно установлен и работает, запустить обертку командой:
```bash
$ node dist/analyse.js
```
