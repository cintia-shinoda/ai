# Verão LNCC 2026 - Uma Introdução às Redes Neurais Informadas pela Física (PINNs - *Physics-Informed-Neural Networks*)

- Minicurso temático do Programa de Verão 2026 do LNCC
- Professor: Vinicius de Carvalho Rispoli (UnB)
- Carga Horária: 6 horas
- 24 a 27 de Fevereiro de 2026

<!-- - Material: https://drive.google.com/drive/folders/157wRdKNiXikGTbA1MoxcZFSGXiytn9ZQ -->

A inteligência artificial baseada em aprendizado de máquina faz parte das nossas vidas cotidianas de várias formas, como por exemplo: carros autônomos e semi-autônomos, reconhecimento facial e de fala, auxílio a diagnósticos médicos, pesquisas do Google, recomendações de produtos e conteúdo nas redes sociais.
Dentro do contexto científico, essas mesmas ferramentas podem ser utilizadas para modelagem de problemas complexos relacionados a leis físicas. Em particular, as redes neurais informadas pela física (do inglês) Physics-Informed Neural Networks - PINNs) são redes neurais que codificam equações modelo, como equações diferenciais parciais, como um componente da própria rede neural. As PINNs são hoje utilizadas para resolver equações diferenciais ordinárias, parciais, fracionárias, integrais e estocásticas.

Este mini-curso será trabalhado em duas etapas lidando tanto com a parte teórica quanto com a prática. Inicialmente serão trabalhados os aspectos matemáticos básicos das redes neurais artificiais e convolucionais, como funções de ativação, funções de perda, otimização, retropropagação e convolução. Em seguida, para fixar o conteúdo, faremos a implementação de um classificador simples utilizando as ferramentas do Python, como o NumPy e Keras/TensorFlow.
Num segundo momento seá discutido como a estrutura das redes neurais artificiais pode ser modificada para a solução de problemas envolvendo equações diferenciais ordinárias e parciais. Nesta etapa serão implementadas as soluções de problemas diretos envolvendo EDOs e EDPs utilizando inicialmente apenas o Keras/TensorFlow e em seguida a biblioteca DeepXDE.

Pré-requisitos: Este curso é pensado para um público sem nenhuma familiaridade com as redes neurais ou aprendizado de máquina. Não obstante, alguns pré-requisitos básicos são recomendados. Deseja-se alguma familiaridade com os seguintes tópicos: cálculo multivariável, introdução à álgebra linear e linguagem Python.

## Programação:

Introdução ao aprendizado de máquina e às redes neurais. Elementos de uma rede neural. Aprendizado supervisionado e não supervisionado. Tipos de redes neurais. Aspectos matemáticos das redes neurais: funções de ativação, retropropagação, otimização e teorema da aproximação universal.
Construindo uma rede neural: Codificação ao vivo de uma rede neural artificial para classificação de dígitos manuscritos usando apenas o NumPy (Dataset da MNIST) e usando o Keras/TensorFlow.
Introdução às redes neurais informadas pela física: Métodos tradicionais vs PINNs. Como codificar um modelo físico nas redes neurais. Tipos de problemas que podem ser resolvidos. Limitações.
Implementando, utilizando o Keras/TensorFlow e a biblioteca DeepXDE, alguns problemas diretos em geometrias distintas envolvendo EDOs e EDPs.


## Bibliografía
I. E. Lagaris, A. Likas, and D. I. Fotiadis. Artificial neural networks for solving ordinary and partial differential equations. IEEE transactions on neural networks, 9(5):987–1000, 1998. https://doi.org/10.1109/72.712178
M. Raissi, P. Perdikaris, and G. E. Karniadakis. Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations. Journal of Computational Physics, 378:686–707, 2019. https://doi.org/10.1016/j.jcp.2018.10.045
Aditi S. Krishnapriyan, Amir Gholami, Shandian Zhe, Robert M. Kirby, Michael W. Mahoney, Characterizing possible failure modes in physics-informed neural networks, arXiv:2109.01050, 2021. https://doi.org/10.48550/arXiv.2109.01050
Lu, Lu and Meng, Xuhui and Mao, Zhiping and Karniadakis, George Em, DeepXDE: A deep learning library for solving differential equations, SIAM Review, 63, 1, 208-228, 2021. https://doi.org/10.1137/19M1274067
Cuomo, S., Di Cola, V.S., Giampaolo, F. et al. Scientific Machine Learning Through Physics–Informed Neural Networks: Where we are and What’s Next. J Sci Comput 92, 88 (2022). https://doi.org/10.1007/s10915-022-01939-z