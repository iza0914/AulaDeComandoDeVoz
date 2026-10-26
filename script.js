
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const conversa = document.getElementById("conversa");
  const campo = document.getElementById("mensagem");
  const btnEnviar = document.getElementById("btnEnviar");
  const btnFalar = document.getElementById("btnFalar");
  const status = document.getElementById("status");
  const chatbot = document.querySelector(".chatbot");

  if (!conversa || !campo || !btnEnviar || !chatbot) {
    console.error("Não foi possível encontrar os elementos necessários no HTML.");
    return;
  }

  const estilos = document.createElement("style");

  estilos.textContent = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      font-family: Arial, sans-serif;
    }

    .chatbot {
      width: 100%;
      max-width: 850px;
      margin: auto;
      overflow: hidden;
      border-radius: 18px;
    }

    .chatbot header {
      overflow-wrap: anywhere;
    }

    .chatbot header h1 {
      font-size: clamp(1.4rem, 4vw, 2rem);
    }

    .painel-assuntos {
      padding: 18px;
      background: #f5f0df;
      color: #533d10;
    }

    .painel-assuntos h2 {
      margin: 0 0 12px;
      font-size: 1.15rem;
    }

    .painel-assuntos p {
      line-height: 1.5;
    }

    .grade-cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .card-assunto {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 7px;
      width: 100%;
      min-width: 0;
      padding: 14px;
      border: 1px solid #d6c8a2;
      border-radius: 12px;
      background: #fffdf5;
      color: #533d10;
      text-align: left;
      white-space: normal;
      overflow-wrap: anywhere;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
    }

    .card-assunto:hover,
    .card-assunto:focus-visible {
      background: #eee2bf;
      transform: translateY(-2px);
    }

    .card-icone {
      font-size: 1.5rem;
    }

    .card-assunto strong {
      font-size: 0.95rem;
    }

    .card-assunto small {
      font-size: 0.8rem;
      line-height: 1.4;
      font-weight: normal;
    }

    .perguntas-sugeridas {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .perguntas-sugeridas button {
      max-width: 100%;
      white-space: normal;
      text-align: left;
      overflow-wrap: anywhere;
      background: #755c18;
    }

    .conversa {
      min-height: 240px;
      max-height: 400px;
      height: 40vh;
      overflow-y: auto;
      overflow-wrap: anywhere;
      scroll-behavior: smooth;
    }

    .mensagem {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }

    .controles {
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
    }

    .controles input {
      min-width: 0;
      width: 100%;
      font-size: 16px;
    }

    .controles button {
      flex-shrink: 0;
    }

    #status {
      min-height: 28px;
      overflow-wrap: anywhere;
      color: #533d10;
    }

    .acoes-resposta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .acoes-resposta button {
      padding: 7px 10px;
      font-size: 0.8rem;
    }

    .chatbot button:focus-visible,
    .chatbot input:focus-visible {
      outline: 3px solid #c48b35;
      outline-offset: 2px;
    }

    @media (max-width: 650px) {
      body {
        padding: 10px;
        align-items: flex-start;
      }

      .chatbot {
        max-width: 100%;
        border-radius: 14px;
      }

      .grade-cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .painel-assuntos {
        padding: 12px;
      }

      .conversa {
        height: 42vh;
        min-height: 220px;
        max-height: 360px;
        padding: 12px;
      }

      .controles {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
        padding: 10px;
      }

      .controles input {
        grid-column: 1 / -1;
        min-height: 44px;
      }

      .controles button {
        min-height: 44px;
      }

      #btnEnviar {
        width: 100%;
      }

      #btnFalar {
        width: 100%;
      }
    }

    @media (max-width: 360px) {
      body {
        padding: 5px;
      }

      .grade-cards {
        grid-template-columns: 1fr;
      }

      .card-assunto {
        padding: 12px;
      }

      .perguntas-sugeridas {
        flex-direction: column;
      }

      .perguntas-sugeridas button {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(estilos);

  const baseConhecimento = [
    {
      termos: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "hello"],
      resposta: "Olá, detetive! Sou sua assistente virtual especializada na saga Enola Holmes. Você pode perguntar sobre personagens, elenco, livros, figurinos, filmagens e bastidores."
    },
    {
      termos: ["tudo bem", "como voce esta", "como vai"],
      resposta: "Tudo ótimo para começar uma investigação! Escolha um dos assuntos nos cards ou digite sua pergunta sobre Enola Holmes."
    },
    {
      termos: ["quem e enola", "enola holmes", "protagonista", "millie bobby brown"],
      resposta: "Enola Holmes é a protagonista dos filmes da Netflix, interpretada por Millie Bobby Brown. Inteligente, observadora e independente, ela é a irmã mais nova de Sherlock e Mycroft Holmes. A personagem foi criada pela escritora Nancy Springer para uma série de livros de mistério juvenil."
    },
    {
      termos: ["sherlock", "mycroft", "irmaos", "familia", "eudoria"],
      resposta: "Sherlock Holmes é o famoso detetive e irmão mais velho de Enola, interpretado por Henry Cavill. Mycroft, interpretado por Sam Claflin, é o outro irmão. Eudoria Holmes, vivida por Helena Bonham Carter, é a mãe de Enola e tem um papel importante na história."
    },
    {
      termos: ["tewkesbury", "lorde", "romance"],
      resposta: "Lorde Tewkesbury é um jovem aristocrata que conhece Enola durante sua primeira aventura. Ele é interpretado por Louis Partridge e tem papel importante nos dois filmes."
    },
    {
      termos: ["elenco", "atores", "atrizes", "quem interpreta"],
      resposta: "O elenco principal inclui Millie Bobby Brown como Enola Holmes, Henry Cavill como Sherlock Holmes, Helena Bonham Carter como Eudoria Holmes, Louis Partridge como Tewkesbury e Sam Claflin como Mycroft Holmes. Adeel Akhtar interpreta o inspetor Lestrade e Susie Wokoma interpreta Edith."
    },
    {
      termos: ["autora", "nancy springer", "livros", "escritora", "inspirado"],
      resposta: "Os filmes são inspirados na série de livros The Enola Holmes Mysteries, escrita por Nancy Springer. Os livros apresentam Enola como uma jovem detetive que resolve mistérios enquanto busca independência em uma sociedade cheia de regras."
    },
    {
      termos: ["primeiro filme", "filme 1", "enola holmes 2020", "historia do primeiro"],
      resposta: "Enola Holmes, lançado em 2020, começa quando a protagonista descobre que sua mãe, Eudoria, desapareceu. Durante sua busca, ela conhece Tewkesbury e se envolve em um mistério que coloca à prova sua inteligência e coragem."
    },
    {
      termos: ["segundo filme", "filme 2", "enola holmes 2", "continuacao"],
      resposta: "Em Enola Holmes 2, lançado em 2022, Enola tenta estabelecer sua própria agência de detetives. Um caso envolvendo o desaparecimento de uma jovem trabalhadora leva a uma investigação maior, que também envolve Sherlock."
    },
    {
      termos: ["gravado", "gravacao", "filmado", "filmagem", "locacoes", "onde foi", "onde foram", "localizacao"],
      resposta: "Os filmes foram produzidos principalmente na Inglaterra, com locações históricas e cenários construídos para recriar a Londres do século XIX. Entre os locais associados à produção estão o Chatham Historic Dockyard e a propriedade Luton Hoo. As locações variam conforme a cena e o filme."
    },
    {
      termos: ["figurino", "figurinos", "roupas", "vestidos", "vestuario", "consolata boyle"],
      resposta: "Os figurinos ajudam a recriar a moda do século XIX. No primeiro filme, o figurino é creditado a Consolata Boyle. As roupas de Enola também ajudam a expressar sua personalidade independente e prática."
    },
    {
      termos: ["maquiagem", "cabelo", "penteados", "caracterizacao"],
      resposta: "A maquiagem, os penteados e a caracterização contribuem para a ambientação histórica dos filmes. Para saber os nomes de todos os profissionais de cada equipe, é necessário consultar os créditos técnicos específicos de cada produção."
    },
    {
      termos: ["diretor", "direcao", "harry bradbeer", "roteiro", "jack thorne"],
      resposta: "Harry Bradbeer dirigiu os dois filmes, e Jack Thorne escreveu os roteiros. As produções combinam mistério, aventura e humor com temas de independência e desigualdade social."
    },
    {
      termos: ["producao", "bastidores", "cenografia", "cenarios", "epoca vitoriana"],
      resposta: "A produção usa locações históricas, cenários, objetos de época, fotografia e figurinos para recriar a Inglaterra do século XIX. Esses elementos ajudam a construir o ambiente social e visual em que Enola resolve seus mistérios."
    },
    {
      termos: ["netflix", "onde assistir", "streaming"],
      resposta: "Enola Holmes, de 2020, e Enola Holmes 2, de 2022, foram lançados pela Netflix. A disponibilidade pode variar de acordo com a região e as mudanças no catálogo."
    },
    {
      termos: ["quantos filmes", "saga", "ordem dos filmes", "ordem para assistir"],
      resposta: "Os dois filmes lançados são Enola Holmes (2020) e Enola Holmes 2 (2022). O ideal é assistir primeiro ao filme de 2020 e depois à continuação de 2022."
    },
    {
      termos: ["mensagem", "tema", "significado", "independencia"],
      resposta: "A saga aborda independência, coragem, inteligência, desigualdade social e a liberdade de escolher o próprio caminho. Enola desafia as expectativas impostas às mulheres de sua época e usa a observação e o raciocínio para resolver mistérios."
    },
    {
      termos: ["obrigado", "obrigada", "valeu", "agradeco"],
      resposta: "De nada, detetive! Se quiser, escolha outro card ou faça uma nova pergunta sobre o universo de Enola Holmes."
    },
    {
      termos: ["tchau", "adeus", "ate logo", "ate mais"],
      resposta: "Até a próxima investigação, detetive! Que sua curiosidade continue levando você a novas descobertas."
    }
  ];

  const assuntos = [
    {
      icone: "🕵️",
      titulo: "Personagens",
      descricao: "Enola, Sherlock e sua família",
      pergunta: "Quem são os principais personagens de Enola Holmes?"
    },
    {
      icone: "🎭",
      titulo: "Elenco",
      descricao: "Atores e atrizes",
      pergunta: "Quem faz parte do elenco de Enola Holmes?"
    },
    {
      icone: "📚",
      titulo: "Livros e autora",
      descricao: "A origem da história",
      pergunta: "Quem escreveu os livros de Enola Holmes?"
    },
    {
      icone: "🎬",
      titulo: "Filmes",
      descricao: "Histórias e continuações",
      pergunta: "Qual é a história dos dois filmes de Enola Holmes?"
    },
    {
      icone: "👗",
      titulo: "Figurinos",
      descricao: "Roupas e caracterização",
      pergunta: "Como foram criados os figurinos de Enola Holmes?"
    },
    {
      icone: "🏰",
      titulo: "Locações",
      descricao: "Onde os filmes foram gravados",
      pergunta: "Onde foram gravados os filmes de Enola Holmes?"
    }
  ];

  const perguntasExemplo = [
    "Quem é Enola Holmes?",
    "Quem interpreta Sherlock Holmes?",
    "Quem escreveu os livros?",
    "Onde os filmes foram gravados?",
    "Como foram feitos os figurinos?"
  ];

  function normalizar(texto) {
    return texto
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function criarPainel() {
    if (chatbot.querySelector(".painel-assuntos")) {
      return;
    }

    const painel = document.createElement("section");
    painel.className = "painel-assuntos";

    const tituloAssuntos = document.createElement("h2");
    tituloAssuntos.textContent = "Explore os mistérios";

    const descricao = document.createElement("p");
    descricao.textContent = "Escolha um assunto para iniciar sua investigação.";

    const grade = document.createElement("div");
    grade.className = "grade-cards";

    assuntos.forEach(assunto => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card-assunto";
      card.setAttribute("aria-label", assunto.titulo + ": " + assunto.descricao);

      const icone = document.createElement("span");
      icone.className = "card-icone";
      icone.textContent = assunto.icone;

      const titulo = document.createElement("strong");
      titulo.textContent = assunto.titulo;

      const texto = document.createElement("small");
      texto.textContent = assunto.descricao;

      card.append(icone, titulo, texto);

      card.addEventListener("click", () => {
        campo.value = assunto.pergunta;
        enviarPergunta();
      });

      grade.appendChild(card);
    });

    const tituloPerguntas = document.createElement("h2");
    tituloPerguntas.textContent = "Cinco perguntas para começar";
    tituloPerguntas.style.marginTop = "20px";

    const sugestoes = document.createElement("div");
    sugestoes.className = "perguntas-sugeridas";

    perguntasExemplo.forEach(pergunta => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = pergunta;

      botao.addEventListener("click", () => {
        campo.value = pergunta;
        enviarPergunta();
      });

      sugestoes.appendChild(botao);
    });

    painel.append(
      tituloAssuntos,
      descricao,
      grade,
      tituloPerguntas,
      sugestoes
    );

    chatbot.insertBefore(painel, conversa);
  }

  function atualizarStatus(texto) {
    if (status) {
      status.textContent = texto;
    }
  }

  function adicionarMensagem(tipo, texto) {
    const elemento = document.createElement("div");
    elemento.className = "mensagem " + tipo;
    elemento.textContent = texto;
    elemento.setAttribute("role", tipo === "bot" ? "status" : "note");

    conversa.appendChild(elemento);
    conversa.scrollTop = conversa.scrollHeight;

    return elemento;
  }

  function encontrarResposta(pergunta) {
    const texto = normalizar(pergunta);

    if (!texto) {
      return "Digite uma pergunta para começarmos a investigação.";
    }

    let melhorResposta = null;
    let maiorPontuacao = 0;

    for (const item of baseConhecimento) {
      let pontuacao = 0;

      for (const termo of item.termos) {
        const chave = normalizar(termo);

        if (texto === chave) {
          pontuacao += 5;
        } else if (texto.includes(chave)) {
          pontuacao += chave.includes(" ") ? 3 : 1;
        } else if (chave.includes(" ") && chave.split(" ").length > 1) {
          const palavras = chave.split(" ");
          const coincidencias = palavras.filter(palavra =>
            texto.split(" ").includes(palavra)
          ).length;

          if (coincidencias === palavras.length) {
            pontuacao += 2;
          }
        }
      }

      if (pontuacao > maiorPontuacao) {
        maiorPontuacao = pontuacao;
        melhorResposta = item.resposta;
      }
    }

    if (melhorResposta && maiorPontuacao > 0) {
      return melhorResposta;
    }

    return "Ainda não encontrei uma resposta confiável para essa pergunta. Tente perguntar sobre os personagens, o elenco, os livros, os filmes, os figurinos, a produção ou os locais de gravação de Enola Holmes.";
  }

  function reproduzirAudio(texto) {
    if (!("speechSynthesis" in window)) {
      atualizarStatus("Seu navegador não oferece leitura de texto em voz alta.");
      return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.pitch = 1;

    fala.onstart = () => {
      atualizarStatus("Reproduzindo a resposta em áudio.");
    };

    fala.onend = () => {
      atualizarStatus("Resposta concluída.");
    };

    fala.onerror = () => {
      atualizarStatus("Não foi possível reproduzir o áudio.");
    };

    window.speechSynthesis.speak(fala);
  }

  function adicionarAcaoAudio(elemento, resposta) {
    const acoes = document.createElement("div");
    acoes.className = "acoes-resposta";

    const ouvir = document.createElement("button");
    ouvir.type = "button";
    ouvir.textContent = "🔊 Ouvir resposta";
    ouvir.setAttribute("aria-label", "Ouvir a resposta em áudio");

    ouvir.addEventListener("click", () => {
      reproduzirAudio(resposta);
    });

    acoes.appendChild(ouvir);
    elemento.appendChild(acoes);
  }

  function enviarPergunta(veioDeVoz = false) {
    const pergunta = campo.value.trim();

    if (!pergunta) {
      atualizarStatus("Digite ou fale uma pergunta antes de enviar.");
      campo.focus();
      return;
    }

    adicionarMensagem(
      "usuario",
      veioDeVoz ? "🎙️ " + pergunta : pergunta
    );

    campo.value = "";

    const resposta = encontrarResposta(pergunta);
    const mensagemResposta = adicionarMensagem("bot", resposta);

    adicionarAcaoAudio(mensagemResposta, resposta);

    atualizarStatus("Resposta enviada.");

    if (veioDeVoz) {
      reproduzirAudio(resposta);
    }
  }

  btnEnviar.addEventListener("click", () => {
    enviarPergunta(false);
  });

  campo.addEventListener("keydown", evento => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      enviarPergunta(false);
    }
  });

  criarPainel();

  const ReconhecimentoVoz =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (btnFalar) {
    if (ReconhecimentoVoz) {
      const reconhecimento = new ReconhecimentoVoz();
      reconhecimento.lang = "pt-BR";
      reconhecimento.interimResults = false;
      reconhecimento.maxAlternatives = 1;

      let ouvindo = false;

      reconhecimento.onstart = () => {
        ouvindo = true;
        btnFalar.textContent = "🎙️ Ouvindo...";
        btnFalar.setAttribute("aria-pressed", "true");
        atualizarStatus("Fale sua pergunta em português.");
      };

      reconhecimento.onresult = evento => {
        const transcricao = evento.results[0][0].transcript.trim();

        campo.value = transcricao;
        enviarPergunta(true);
      };

      reconhecimento.onerror = evento => {
        const mensagensErro = {
          "not-allowed": "Permita o acesso ao microfone nas configurações do navegador.",
          "no-speech": "Nenhuma fala foi detectada. Tente novamente.",
          "audio-capture": "Não foi possível encontrar um microfone.",
          "network": "O reconhecimento de voz apresentou um erro de rede."
        };

        atualizarStatus(
          mensagensErro[evento.error] ||
          "Não foi possível reconhecer sua voz. Tente digitar a pergunta."
        );
      };

      reconhecimento.onend = () => {
        ouvindo = false;
        btnFalar.textContent = "🎙️ Falar";
        btnFalar.setAttribute("aria-pressed", "false");
      };

      btnFalar.addEventListener("click", () => {
        if (ouvindo) {
          reconhecimento.stop();
          return;
        }

        try {
          reconhecimento.start();
        } catch (erro) {
          atualizarStatus("Aguarde um instante antes de falar novamente.");
        }
      });
    } else {
      btnFalar.addEventListener("click", () => {
        atualizarStatus(
          "O reconhecimento de voz não está disponível neste navegador. Você ainda pode digitar suas perguntas."
        );
      });
    }
  }

  adicionarMensagem(
    "bot",
    "Olá, detetive! Sou sua assistente sobre Enola Holmes. Escolha um card, experimente uma das cinco perguntas ou digite sua própria investigação."
  );

  atualizarStatus(
    "Assistente pronta. Digite uma pergunta ou use o microfone."
  );

  estilos.textContent = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 12px;
    min-height: 100vh;
    font-family: Arial, sans-serif;
  }

  .chatbot {
    width: 100%;
    max-width: 650px;
    margin: auto;
    border-radius: 14px;
    overflow: hidden;
  }

  .chatbot header {
    padding: 14px 18px;
  }

  .chatbot header h1 {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    margin-bottom: 6px;
  }

  .chatbot header p {
    font-size: 0.9rem;
  }

  .painel-assuntos {
    padding: 12px;
    background: #f5f0df;
    color: #533d10;
  }

  .painel-assuntos h2 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .painel-assuntos p {
    margin: 6px 0;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .grade-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .card-assunto {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
    min-width: 0;
    padding: 9px;
    border: 1px solid #d6c8a2;
    border-radius: 9px;
    background: #fffdf5;
    color: #533d10;
    text-align: left;
    white-space: normal;
    overflow-wrap: anywhere;
    cursor: pointer;
    transition: background 0.2s;
  }

  .card-assunto:hover {
    background: #eee2bf;
  }

  .card-icone {
    font-size: 1.2rem;
  }

  .card-assunto strong {
    font-size: 0.82rem;
  }

  .card-assunto small {
    font-size: 0.72rem;
    line-height: 1.3;
    font-weight: normal;
  }

  .perguntas-sugeridas {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }

  .perguntas-sugeridas button {
    padding: 7px 9px;
    font-size: 0.78rem;
    white-space: normal;
    text-align: left;
  }

  .conversa {
    height: 300px;
    min-height: 200px;
    max-height: 350px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    overflow-wrap: anywhere;
  }

  .mensagem {
    max-width: 85%;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 0.9rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .controles {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    padding: 10px;
  }

  .controles input {
    flex: 1;
    min-width: 100px;
    padding: 9px;
    font-size: 16px;
  }

  .controles button {
    padding: 8px 11px;
    font-size: 0.82rem;
  }

  #status {
    min-height: 24px;
    padding: 5px;
    font-size: 0.8rem;
    overflow-wrap: anywhere;
    color: #533d10;
  }

  .acoes-resposta {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 6px;
  }

  .acoes-resposta button {
    padding: 6px 8px;
    font-size: 0.75rem;
  }

  @media (max-width: 600px) {
    body {
      padding: 8px;
    }

    .chatbot {
      max-width: 100%;
    }

    .grade-cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .conversa {
      height: 280px;
      max-height: 320px;
    }

    .controles {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .controles input {
      grid-column: 1 / -1;
      width: 100%;
    }

    .controles button {
      width: 100%;
      min-height: 38px;
    }
  }

  @media (max-width: 340px) {
    .grade-cards {
      grid-template-columns: 1fr;
    }

    .card-assunto {
      padding: 8px;
    }

    .perguntas-sugeridas {
      flex-direction: column;
    }

    .perguntas-sugeridas button {
      width: 100%;
    }
  }
`;
});
