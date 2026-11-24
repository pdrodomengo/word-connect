// Lista das 6 fases do jogo, aumentando a dificuldade aos poucos
const FASES = [
  {
    numero: 1,
    cenarioClasse: "cenario-mar",
    cenarioNome: "Fundo do Mar",
    corDecoracao: "#38bdf8",
    letras: ["L", "E", "R", "A"],
    palavras: [
      {
        texto: "LER",
        classe: "Verbo (Ação)",
        dica: "Ação de passar os olhos por um livro ou texto.",
        explicacao: "Acertou! 'Ler' é um verbo porque indica uma ação."
      },
      {
        texto: "REAL",
        classe: "Substantivo",
        dica: "Nome da moeda usada no Brasil.",
        explicacao: "Muito bem! 'Real' aqui dá nome à nossa moeda, sendo um substantivo."
      }
    ]
  },
  {
    numero: 2,
    cenarioClasse: "cenario-floresta",
    cenarioNome: "Floresta Tropical",
    corDecoracao: "#4ade80",
    letras: ["C", "O", "P", "A", "R"],
    palavras: [
      {
        texto: "COPA",
        classe: "Substantivo",
        dica: "Parte mais alta das árvores ou um troféu.",
        explicacao: "Isso aí! 'Copa' dá nome a um objeto ou parte da árvore (substantivo)."
      },
      {
        texto: "CORAR",
        classe: "Verbo (Ação)",
        dica: "Ação de ficar com o rosto vermelho de vergonha.",
        explicacao: "Excelente! 'Corar' expressa uma ação ou mudança de estado (verbo)."
      }
    ]
  },
  {
    numero: 3,
    cenarioClasse: "cenario-montanha",
    cenarioNome: "Montanhas Geladas",
    corDecoracao: "#818cf8",
    letras: ["P", "E", "D", "R", "A"],
    palavras: [
      {
        texto: "PEDRA",
        classe: "Substantivo",
        dica: "Objeto sólido e duro encontrado na natureza.",
        explicacao: "Boa! 'Pedra' nomeia um ser/objeto concreto, então é um substantivo."
      },
      {
        texto: "ARDER",
        classe: "Verbo (Ação)",
        dica: "Ação de queimar ou causar sensação de calor forte.",
        explicacao: "Perfeito! 'Arder' indica uma ação/fenômeno, por isso é um verbo."
      }
    ]
  },
  {
    numero: 4,
    cenarioClasse: "cenario-deserto",
    cenarioNome: "Deserto Dourado",
    corDecoracao: "#fbbf24",
    letras: ["C", "A", "N", "T", "O"],
    palavras: [
      {
        texto: "CANTO",
        classe: "Substantivo",
        dica: "Lugar onde duas paredes se encontram ou uma melodia.",
        explicacao: "Acertou! 'Canto' dá nome a um lugar ou som (substantivo)."
      },
      {
        texto: "CONTAR",
        classe: "Verbo (Ação)",
        dica: "Ação de calcular números ou narrar uma história.",
        explicacao: "Mandou bem! 'Contar' é uma ação realizada por alguém (verbo)."
      }
    ]
  },
  {
    numero: 5,
    cenarioClasse: "cenario-espaco",
    cenarioNome: "Espaço Sideral",
    corDecoracao: "#c084fc",
    letras: ["P", "L", "A", "N", "T", "A"],
    palavras: [
      {
        texto: "PLANTA",
        classe: "Substantivo",
        dica: "Ser vivo que faz fotossíntese, como uma árvore ou flor.",
        explicacao: "Show! 'Planta' nomeia um ser vivo (substantivo)."
      },
      {
        texto: "PLANTAR",
        classe: "Verbo (Ação)",
        dica: "Ação de colocar uma semente ou muda na terra.",
        explicacao: "Isso mesmo! 'Plantar' termina em -AR e indica uma ação (verbo)."
      }
    ]
  },
  {
    numero: 6,
    cenarioClasse: "cenario-aurora",
    cenarioNome: "Aurora Boreal",
    corDecoracao: "#2dd4bf",
    letras: ["E", "S", "T", "U", "D", "O"],
    palavras: [
      {
        texto: "ESTUDO",
        classe: "Substantivo",
        dica: "O ato de aprender ou um trabalho de pesquisa.",
        explicacao: "Incrível! 'Estudo' aqui funciona como o nome de uma atividade (substantivo)."
      },
      {
        texto: "ESTUDAR",
        classe: "Verbo (Ação)",
        dica: "Ação de ler, praticar e buscar conhecimento.",
        explicacao: "Parabéns! 'Estudar' é o verbo que representa a ação de aprender."
      }
    ]
  }
];

// Variáveis de estado do jogo
let indiceFaseAtual = 0;
let pontos = 0;
let palavrasDescobertas = [];
let indicesSelecionados = [];
let letrasEmbaralhadas = [];
let arrastando = false;
let tempoInicio = 0;

// Pontuação máxima possível (100 pontos por palavra = 1200 pontos)
const PONTOS_POR_PALAVRA = 100;
const PONTUACAO_MAXIMA = FASES.reduce((total, fase) => total + fase.palavras.length * PONTOS_POR_PALAVRA, 0);

// Elementos da tela
const telaInicio = document.getElementById("tela-inicio");
const telaJogo = document.getElementById("tela-jogo");
const telaFim = document.getElementById("tela-fim");
const textoFase = document.getElementById("texto-fase");
const textoPontos = document.getElementById("texto-pontos");
const textoProgressoPalavras = document.getElementById("texto-progresso-palavras");
const nomeCenario = document.getElementById("nome-cenario");
const fundoDecoracao = document.getElementById("fundo-decoracao");
const listaPalavrasAlvo = document.getElementById("lista-palavras-alvo");
const caixaFeedback = document.getElementById("caixa-feedback");
const palavraFormadaEl = document.getElementById("palavra-formada");
const rodaLetras = document.getElementById("roda-letras");
const svgLinhas = document.getElementById("svg-linhas");

// Botões
const btnIniciar = document.getElementById("btn-iniciar");
const btnEmbaralhar = document.getElementById("btn-embaralhar");
const btnLimpar = document.getElementById("btn-limpar");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");
const btnTema = document.getElementById("btn-tema");
const btnTelaCheia = document.getElementById("btn-tela-cheia");

// Envia a altura atual da página para o portal
function notificarAlturaPortal() {
  const altura = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "vrgame:resize", height: altura }, "*");
}

// Alterna entre tema escuro e tema claro
function aplicarTema(tema) {
  const temaValido = tema === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", temaValido);
  notificarAlturaPortal();
}

// Alterna modo tela cheia
function alternarTelaCheia() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// Cria bolhas/estrelas decorativas de acordo com o cenário da fase
function desenharDecoracaoCenario(cor) {
  fundoDecoracao.innerHTML = "";
  const posicoes = [
    { top: "10%", left: "12%", tamanho: 90 },
    { top: "25%", left: "80%", tamanho: 130 },
    { top: "65%", left: "15%", tamanho: 110 },
    { top: "78%", left: "75%", tamanho: 150 },
    { top: "45%", left: "48%", tamanho: 70 }
  ];

  posicoes.forEach((pos, idx) => {
    const bolha = document.createElement("div");
    bolha.className = "elemento-cenario";
    bolha.style.top = pos.top;
    bolha.style.left = pos.left;
    bolha.style.width = `${pos.tamanho}px`;
    bolha.style.height = `${pos.tamanho}px`;
    bolha.style.background = cor;
    bolha.style.animationDelay = `${idx * 0.8}s`;
    fundoDecoracao.appendChild(bolha);
  });
}

// Atualiza os textos do painel superior
function atualizarPainel() {
  const fase = FASES[indiceFaseAtual];
  textoFase.textContent = `${fase.numero} / ${FASES.length}`;
  textoPontos.textContent = pontos;
  textoProgressoPalavras.textContent = `${palavrasDescobertas.length} / ${fase.palavras.length}`;
}

// Mostra mensagem explicativa de acerto, erro ou instrução
function mostrarFeedback(mensagem, tipo) {
  caixaFeedback.textContent = mensagem;
  caixaFeedback.className = `feedback ${tipo}`;
}

// Embaralha um array sem alterar o original
function misturarArray(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Desenha as caixinhas das palavras que o jogador precisa descobrir na fase
function renderizarPalavrasAlvo() {
  const fase = FASES[indiceFaseAtual];
  listaPalavrasAlvo.innerHTML = "";

  fase.palavras.forEach((item) => {
    const descoberta = palavrasDescobertas.includes(item.texto);
    const card = document.createElement("div");
    card.className = "item-palavra-alvo";

    const linhaDica = document.createElement("div");
    linhaDica.className = "dica-palavra";
    linhaDica.innerHTML = `<span class="etiqueta-classe">${item.classe}</span> ${item.dica}`;

    const linhaCaixas = document.createElement("div");
    linhaCaixas.className = "caixinhas-letras";

    for (let i = 0; i < item.texto.length; i++) {
      const caixa = document.createElement("div");
      caixa.className = descoberta ? "caixinha revelada" : "caixinha";
      caixa.textContent = descoberta ? item.texto[i] : "";
      linhaCaixas.appendChild(caixa);
    }

    card.appendChild(linhaDica);
    card.appendChild(linhaCaixas);
    listaPalavrasAlvo.appendChild(card);
  });
}

// Desenha os botões das letras em círculo
function renderizarRodaLetras() {
  rodaLetras.innerHTML = "";
  svgLinhas.innerHTML = "";
  const total = letrasEmbaralhadas.length;
  const raio = 85;
  const centro = 120;

  letrasEmbaralhadas.forEach((letra, index) => {
    const angulo = (index / total) * (2 * Math.PI) - Math.PI / 2;
    const x = centro + raio * Math.cos(angulo);
    const y = centro + raio * Math.sin(angulo);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-letra";
    botao.textContent = letra;
    botao.style.left = `${x}px`;
    botao.style.top = `${y}px`;
    botao.dataset.indice = index;
    botao.dataset.x = x;
    botao.dataset.y = y;

    // Permite clicar ou iniciar o arraste
    botao.addEventListener("pointerdown", (evento) => {
      evento.preventDefault();
      arrastando = true;
      selecionarLetra(index);
    });

    rodaLetras.appendChild(botao);
  });

  atualizarVisualSelecao();
}

// Adiciona uma letra à sequência atual
function selecionarLetra(indice) {
  if (!indicesSelecionados.includes(indice)) {
    indicesSelecionados.push(indice);
    atualizarVisualSelecao();
  }
}

// Atualiza o destaque das letras escolhidas e desenha as linhas conectando elas
function atualizarVisualSelecao() {
  const botoes = rodaLetras.querySelectorAll(".botao-letra");
  svgLinhas.innerHTML = "";

  botoes.forEach((btn) => {
    const idx = Number(btn.dataset.indice);
    if (indicesSelecionados.includes(idx)) {
      btn.classList.add("selecionada");
    } else {
      btn.classList.remove("selecionada");
    }
  });

  // Desenha linhas ligando as letras selecionadas
  for (let i = 0; i < indicesSelecionados.length - 1; i++) {
    const btnAtual = botoes[indicesSelecionados[i]];
    const btnProximo = botoes[indicesSelecionados[i + 1]];
    if (btnAtual && btnProximo) {
      const linha = document.createElementNS("http://www.w3.org/2000/svg", "line");
      linha.setAttribute("x1", btnAtual.dataset.x);
      linha.setAttribute("y1", btnAtual.dataset.y);
      linha.setAttribute("x2", btnProximo.dataset.x);
      linha.setAttribute("y2", btnProximo.dataset.y);
      linha.setAttribute("stroke", "#38bdf8");
      linha.setAttribute("stroke-width", "6");
      linha.setAttribute("stroke-linecap", "round");
      svgLinhas.appendChild(linha);
    }
  }

  const textoAtual = indicesSelecionados.map((i) => letrasEmbaralhadas[i]).join("");
  palavraFormadaEl.textContent = textoAtual || "_";
}

// Limpa a seleção atual de letras
function limparSelecao() {
  indicesSelecionados = [];
  atualizarVisualSelecao();
}

// Verifica se a palavra formada existe na fase atual
function verificarPalavra() {
  const palavraDigitada = indicesSelecionados.map((i) => letrasEmbaralhadas[i]).join("");
  limparSelecao();

  if (palavraDigitada.length < 2) {
    mostrarFeedback("Junte pelo menos 2 letras para formar uma palavra!", "erro");
    return;
  }

  const fase = FASES[indiceFaseAtual];
  const alvoEncontrado = fase.palavras.find((p) => p.texto === palavraDigitada);

  if (!alvoEncontrado) {
    mostrarFeedback(`A palavra "${palavraDigitada}" não está nas dicas desta fase. Leia as dicas e tente de novo!`, "erro");
    return;
  }

  if (palavrasDescobertas.includes(palavraDigitada)) {
    mostrarFeedback(`Você já descobriu "${palavraDigitada}"! Tente formar a outra palavra da fase.`, "neutro");
    return;
  }

  // Acerto!
  palavrasDescobertas.push(palavraDigitada);
  pontos += PONTOS_POR_PALAVRA;
  atualizarPainel();
  renderizarPalavrasAlvo();
  mostrarFeedback(alvoEncontrado.explicacao, "acerto");

  // Verifica se completou todas as palavras da fase
  if (palavrasDescobertas.length === fase.palavras.length) {
    setTimeout(() => {
      avancarFase();
    }, 1600);
  }
}

// Carrega uma fase pelo índice
function carregarFase(indice) {
  indiceFaseAtual = indice;
  const fase = FASES[indiceFaseAtual];
  palavrasDescobertas = [];
  indicesSelecionados = [];
  letrasEmbaralhadas = misturarArray(fase.letras);

  // Troca a paisagem de fundo
  document.body.className = fase.cenarioClasse;
  nomeCenario.textContent = `Cenário: ${fase.cenarioNome}`;
  desenharDecoracaoCenario(fase.corDecoracao);

  atualizarPainel();
  renderizarPalavrasAlvo();
  renderizarRodaLetras();
  mostrarFeedback(`Fase ${fase.numero}: ${fase.cenarioNome}! Forme as palavras das dicas.`, "neutro");
  notificarAlturaPortal();
}

// Passa para a próxima fase ou encerra o jogo
function avancarFase() {
  if (indiceFaseAtual + 1 < FASES.length) {
    carregarFase(indiceFaseAtual + 1);
  } else {
    finalizarJogo();
  }
}

// Mostra a tela final e envia o resultado ao portal
function finalizarJogo() {
  const tempoTotalMs = Date.now() - tempoInicio;
  const segundos = Math.max(1, Math.round(tempoTotalMs / 1000));

  telaJogo.classList.add("oculto");
  telaFim.classList.remove("oculto");

  document.getElementById("pontos-finais").textContent = pontos;
  document.getElementById("tempo-final").textContent = `${segundos}s`;

  // Envia mensagem de conclusão exigida pelo portal
  window.parent.postMessage(
    {
      type: "vrgame:finish",
      score: pontos,
      maxScore: PONTUACAO_MAXIMA,
      timeMs: tempoTotalMs,
      detail: { jogo: "word-classes" }
    },
    "*"
  );

  notificarAlturaPortal();
}

// Inicia ou reinicia a partida
function iniciarPartida() {
  pontos = 0;
  tempoInicio = Date.now();
  telaInicio.classList.add("oculto");
  telaFim.classList.add("oculto");
  telaJogo.classList.remove("oculto");
  carregarFase(0);
}

// Eventos de arrastar o dedo/mouse pela roda de letras
rodaLetras.addEventListener("pointermove", (evento) => {
  if (!arrastando) return;
  const elementoSobDedo = document.elementFromPoint(evento.clientX, evento.clientY);
  if (elementoSobDedo && elementoSobDedo.classList.contains("botao-letra")) {
    const idx = Number(elementoSobDedo.dataset.indice);
    selecionarLetra(idx);
  }
});

window.addEventListener("pointerup", () => {
  if (arrastando) {
    arrastando = false;
    // Se o jogador arrastou 2 ou mais letras, verifica automaticamente
    if (indicesSelecionados.length >= 2) {
      verificarPalavra();
    }
  }
});

// Eventos dos botões
btnIniciar.addEventListener("click", iniciarPartida);
btnJogarNovamente.addEventListener("click", iniciarPartida);
btnLimpar.addEventListener("click", limparSelecao);
btnConfirmar.addEventListener("click", verificarPalavra);

btnEmbaralhar.addEventListener("click", () => {
  letrasEmbaralhadas = misturarArray(letrasEmbaralhadas);
  limparSelecao();
  renderizarRodaLetras();
});

btnTema.addEventListener("click", () => {
  const atual = document.documentElement.getAttribute("data-theme");
  aplicarTema(atual === "dark" ? "light" : "dark");
});

btnTelaCheia.addEventListener("click", alternarTelaCheia);

// Escuta mensagens enviadas pelo portal (tema e tela cheia)
window.addEventListener("message", (evento) => {
  const dados = evento.data;
  if (!dados || typeof dados !== "object") return;

  if (dados.type === "vrgame:theme" && dados.theme) {
    aplicarTema(dados.theme);
  } else if (dados.type === "vrgame:fullscreen") {
    alternarTelaCheia();
  }
});

window.addEventListener("resize", notificarAlturaPortal);

// Inicialização ao abrir o jogo
window.addEventListener("DOMContentLoaded", () => {
  desenharDecoracaoCenario(FASES[0].corDecoracao);
  window.parent.postMessage({ type: "vrgame:ready" }, "*");
  notificarAlturaPortal();
});