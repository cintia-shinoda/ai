import streamlit as st
from langchain_ollama import ChatOllama

# Criar conexão com o DeepSeek
llm = ChatOllama(model='deepseek-r1:1.5b', base_url="http://localhost:11434")


st.set_page_config(page_title="Chat DeepSeek", layout="centered")
st.title("Teste Local DeepSeek")

if "mensagens" not in st.session_state:
    st.session_state['mensagens'] = []

mensagens = st.session_state['mensagens']
for tipo, conteudo in mensagens:
    chat = st.chat_message(tipo)
    chat.markdown(conteudo)

# Texto de entrada do usuário
prompt = st.chat_input('Faça uma pergunta para o DeepSeek... ')

if prompt:
    mensagens.append(('human', prompt))


    chat = st.chat_message('human')
    chat.markdown(prompt)

    resposta = llm.invoke(mensagens).content
    mensagens.append(('ai', resposta))

    chat = st.chat_message('ai')
    chat.markdown(resposta)