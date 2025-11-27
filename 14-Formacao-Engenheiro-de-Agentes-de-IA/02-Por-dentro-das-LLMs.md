# Por dentro das LLMs - como funcionam modelos como ChatGPT?

## 1. Conhecendo as LLMs

### O que você vai aprender neste curso?
- Deep Dive into LLMs like ChatGPT | Andrej Karpath: https://www.youtube.com/watch?v=7xTGNNLPyMI


### Transformers e LLMs
- artigo: Attention Is All You Need (https://arxiv.org/abs/1706.03762)
  - 2017: Google Brain
  - arquitetura: Transformer

---

## 2. Como treinar uma LLM?
### 1ª etapa: Processar toda a Internet
- blocos de atenção
- Common Crawl
- FineWeb
  - Blacklists UT1 - Université Toulouse Capitole (dsi.ut-capitole.fr/blacklists/)
  - text extraction
  - language filtering (idiomas)
  - PII removal (Personally Identifiable Information) - remoção de dados privados

### 2ª etapa: Tokenização
- texto -> binários -> bits -> byte (8 bits) -> tokens
- Byte Pair Encoding (BPE)
- Tiktokenizer (tiktokenizer.vercel.app)
- relações estatísticas entre tokens

### 3ª etapa: Realizando o pretraining
- curva de distribuição de probabilidade
- next token prediction
- vídeo: https://youtu.be/LPZh9BOjkQs?si=_56zayGTpZKllLS7
- parâmetros: pesos e vieses
- janela de contexto (context window)

### As propriedades de um modelo BASE
- Hperbolic (app.hyperbolic.xyz/)
- modelo base: simulador da Internet
- alucinações (hallucinations)
- in-context learning

### 4ª etapa: Supervised Fine-Tuning
- artigo: Training language models to follow instructions with human feedback | Mar 2022 - OpenAI (https://arxiv.org/abs/2203.02155)
- novo conjunto de treino

---

## 3. Aprimorando uma LLM
### Lidando com Alucinações e usando Ferramentas
- modelo base -> assistente
- artigo: The Llama 3 Herd of Models | Jul 2024 - Meta (https://arxiv.org/abs/2407.21783) - Seção 4.3.6 Factuality
- LLM Visualization (bbycroft.net/llm)
- adição de funções de pesquisa

### Modelos precisam de tokens para pensar
- engenharia de prompts
- cadeia de pensamento (chain of thought)
- artigo: 

---

## 4. Aprendizado por Reforço
### 5ª etapa: Reinforcement Learning
- benchmarking

### DeepSeek e Indicações
- etapa de reinforcement learning ainda não está bem estabelecida
- DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning | Jan 2025 - DeepSeek AI (https://arxiv.org/pdf/2501.12948)
  - Aha Moment
- AI Leaderboard (https://lmarena.ai/leaderboard)
- Newsletter AINews (https://news.smol.ai)
- trending repositories no GitHub (https://github.com/trending)
- https://www.reddit.com/r/LocalLLaMA/