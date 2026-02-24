# Projeto: Chat DeepSeek

## Rodando o DeepSeek localmente pelo Ollama
https://ollama.com/download

https://ollama.com/library/deepseek-r1

- 1.5 b de parâmetros


```shell
ollama   # verifica instalação
```

```shell
ollama serve   # inicia ollama
```

```shell
ollama pull deepseek-r1:1.5b  # baixa o modelo
```

```shell
ollama run deepseek-r1:1.5b  # roda o modelo
```

``` shell
ctrl + D   # para sair
```

```shell
ollama list  # lista os modelos

```

## Criando uma interface web para o DeepSeek
``` shell
pip install streamlit langchain-ollama
```





## Disponibilizando o DeepSeek na web
- ngrok

