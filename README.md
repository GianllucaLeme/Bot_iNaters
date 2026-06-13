<h1 align="center">🤖 Bot iNaters 🤖</h1>

<p align="center">
  <img src="https://img.shields.io/github/v/tag/GianllucaLeme/Bot_iNaters?label=versão" alt="Versão">
</p>

## Sobre

Bot de automação para grupos de WhatsApp desenvolvido com [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js). Criado para uso em grupos privados de naturalistas, o bot permite mencionar membros por categoria taxonômica, enviar mídias, easter eggs, e oferece controles administrativos por grupo.

## Tecnologias utilizadas

- Node.js
- whatsapp-web.js
- Puppeteer
- qrcode-terminal

---

## Funcionalidades

### Sistema de menções

O bot possui mais de **45** comandos de menção, cada um associado a um grupo específico de membros. Ao enviar um comando como `/aranha` ou `/formiga`, o bot menciona automaticamente os participantes cadastrados naquela categoria.

- Suporte a aliases: múltiplos nomes para o mesmo comando (`/cobra` e `/serpente`, por exemplo)
- Alguns membros têm chance probabilística de serem incluídos na menção (evita spam de marcações para aqueles que não querem ser marcados a todo momento)

### Easter eggs

Um conjunto separado de comandos envia stickers, áudios, imagens e mensagens especiais, associados a pessoas ou situações específicas dos grupos.

### Comandos para grupos específicos

Conjunto exclusivo de comandos disponível apenas para membros de um grupo específico.

### Pausa por grupo (`/stop` e `/start`)

Administradores podem pausar e retomar o bot individualmente por grupo, sem afetar os demais grupos ativos.

### Comandos administrativos

- `/admin` — menciona até dois administradores do grupo aleatoriamente
- `/all` — menciona todos os participantes do grupo
- `/stop` — pausa o bot no grupo atual
- `/start` — retoma o bot no grupo atual

### Comandos de ajuda

- `/help` — lista os comandos de menção disponíveis
- `/help2` — lista os comandos alternativos
- `/sobre` — exibe informações sobre o bot e sua versão atual
- `/sac` — Fornece o link para o **SAC - iNaturalist**
- `/tirar_nome` — solicita a remoção do remetente das listas de menção

### Watchdog automático

Processo separado que monitora o bot, reinicia-o a cada **30** minutos, verifica conexão com a internet antes de cada ciclo, e envia uma notificação nos grupos configurados a cada **6** reinicializações.

---

## Arquitetura

O projeto é dividido em camadas com responsabilidades bem definidas:

```text
main.js          — Inicialização do cliente WhatsApp, event listeners e dispatch de comandos
watchdog.js      — Processo independente de monitoramento e reinício automático
commands/        — Roteadores de comandos por família
config/          — Configurações estáticas: grupos, contatos, caminhos e listas de comandos
lib/             — Utilitários compartilhados
```

O despacho de comandos segue um pipeline com early-return:

```text
mensagem recebida
  → normalização do texto
  → verificação de remetente permitido
  → verificação de pausa do grupo
  → controle de spam (cooldown de 3s por usuário)
  → Comandos() → ComandosEasterEgg() → ComandosAdmin() → ComandosAjuda() → Comandosaga()
```

Cada família de comandos usa um `Map` como tabela de despacho, facilitando a adição de novos comandos.

---

## Estrutura do projeto

```text
bot_inaters/
├── main.js                          # Ponto de entrada principal do bot
├── watchdog.js                      # Processo de monitoramento e reinício automático
├── contacts.json                    # ⚠️ Arquivo de contatos (dados sensíveis, modificar conforme necessário)
│
├── config/
│   ├── commandList.js               # Listas de todos os comandos registrados
│   ├── contacts_load.js             # Carregamento do contacts.json
│   ├── groups.js                    # IDs dos grupos permitidos
│   └── paths.js                     # Caminhos para arquivos de controle em runtime
│
├── commands/
│   ├── core.js                      # Roteador dos comandos de menção
│   ├── easter.js                    # Roteador dos comandos easter egg
│   ├── aga.js                       # Roteador dos comandos exclusivos do grupo "aga"
│   ├── admin.js                     # Roteador dos comandos administrativos
│   ├── help.js                      # Roteador dos comandos de ajuda
│   │
│   ├── handlers/                    # Lógica de envio de mensagens
│   │   ├── mentionSender.js         # Envio de menções
│   │   ├── easterSender.js          # Envio de stickers, áudios e mídias easter egg
│   │   ├── agaSender.js             # Envio de áudios e menções do grupo "aga"
│   │   ├── adminSender.js           # Verificação de admin e envio de menções administrativas
│   │   └── helpSender.js            # Envio de mensagens de ajuda e informações
│   │
│   ├── helpers/                     # Configuração dos comandos (dados)
│   │   ├── mentionCommands.js       # Mapa de comandos de menção com membros e descrições
│   │   ├── easterCommands.js        # Mapa de comandos easter egg com configuração de mídia
│   │   └── agaCommands.js           # Mapa de áudios do grupo "aga"
│   │
│   └── maps/                        # Tabelas de aliases
│       ├── mentionAliases.js        # Aliases para comandos de menção
│       ├── easterAliases.js         # Aliases para comandos easter egg
│       └── agaAliases.js            # Aliases para comandos do grupo "aga"
│
├── lib/
│   ├── utils.js                     # Normalização de comandos, utilitários e persistência de pausa
│   └── internet.js                  # Verificação de conectividade
│
└── pictures/                        # ⚠️ Arquivos de mídia (dados sensíveis, modificar conforme necessário)
```

---

## Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v8 ou superior
- Uma conta de WhatsApp ativa para autenticação via QR Code
- Conexão com a internet durante a execução

> O watchdog utiliza `node.exe` internamente — em sistemas Linux/macOS, altere essa chamada para `node` no arquivo `watchdog.js`.

---

## Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/GianllucaLeme/Bot_iNaters.git
cd bot_inaters
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure os arquivos necessários** (ver seção [Configuração](#configuração))

4. **Execute o bot**

```bash
npm start
```

Na primeira execução, um QR Code será exibido no terminal. Escaneie-o com o WhatsApp do dispositivo que será usado como conta do bot.

---

## Configuração

### `contacts.json` ⚠️ obrigatório

Este arquivo não está incluído no repositório por conter dados pessoais. Crie-o na raiz do projeto com a seguinte estrutura:

```json
{
  "grupo_iNaturalisters": "120363000000000001",
  "grupo_teste":          "120363000000000002",
  "grupo_aga":            "120363000000000003",

  "aranhas": {
    "usuario_x": "5511900000001"
  },

  "abelhas": {
    "usuario_y": "5511900000002"
  }
}
```

Os IDs dos grupos são obtidos ao inspecionar o `message.from` nos logs do bot quando uma mensagem é recebida em cada grupo.

> Os IDs de grupos do WhatsApp terminam em `@g.us`; os IDs de usuários terminam em `@c.us`. Nos arquivos de configuração, informe apenas a parte numérica (sem o sufixo).

### `config/groups.js`

Lista os grupos que o bot monitora e cujos membros podem usar os comandos:

```js
const gruposPermitidos = [
    `${c.grupo_iNaturalisters}@g.us`,
    `${c.grupo_bot_iNaters}@g.us`,
    // ...
];
```

Adicione ou remova grupos conforme necessário.

### `pictures/` ⚠️ obrigatório para easter eggs e áudios

O diretório `pictures/` contém os arquivos de mídia referenciados pelos comandos easter egg e do grupo `aga`. Não está incluído no repositório. A estrutura de subpastas é inferida pela configuração em `commands/helpers/easterCommands.js`.

---

## Como usar

### Iniciar o bot pela rotina (watchdog)

```bash
npm start
```

O watchdog inicia o `main.js` automaticamente, monitora sua execução e o reinicia conforme necessário.

### Iniciar apenas o bot (sem watchdog) [Developer]

```bash
npm run dev
```

### Parar completamente o watchdog [Developer]

Crie um arquivo chamado `KILL` na raiz do projeto. O watchdog encerrará o processo no próximo ciclo de verificação.

```bash
touch KILL     # Linux/macOS
echo. > KILL   # Windows
```

---

### Pausar e retomar o bot por grupo

Qualquer administrador do grupo pode enviar os comandos diretamente no chat:

| Comando  | Ação                                       |
|----------|------                                      |
| `/stop`  | Pausa o bot **somente** no grupo atual     |
| `/start` | Retoma o bot **somente** no grupo atual    |

- Os demais grupos continuam funcionando normalmente enquanto um grupo está pausado.
- O estado de pausa é persistido em `pausedGroups.json` e sobrevive a reinicializações.
- Apenas administradores do grupo (ou o administrador do sistema) podem usar esses comandos.

---

## Notas técnicas

### Mecanismo de reinício (watchdog)

O `watchdog.js` é um processo Node.js independente que:

1. Verifica conexão com a internet antes de cada ciclo
2. Inicia o `main.js` como subprocesso via `spawn`
3. Aguarda até **30** minutos e então encerra e reinicia o subprocesso preventivamente
4. Detecta quedas inesperadas (`code !== 0`) e reinicia imediatamente
5. A cada **6** reinicializações, grava `RESTART_NOTICE` para que o bot envie uma notificação nos grupos configurados
6. Apaga o cache do Chromium (`.wwebjs_cache`) a cada ciclo para evitar problemas de sessão do `whatsapp-web.js`

### Persistência de pausa por grupo

O estado de pausa é armazenado em `pausedGroups.json` na raiz do projeto:

```json
{
  "120363123456789@g.us": true
}
```

- Somente grupos pausados aparecem no arquivo; grupos ativos não são listados
- O arquivo é lido em memória na inicialização do bot e atualizado em disco apenas quando `/stop` ou `/start` é executado
- O `pausedGroups.json` é ignorado pelo Git e pelo watchdog ao iniciar

### Normalização de comandos

Antes de qualquer despacho, o texto recebido passa por `normalizarComando()`, que:

- Converte para minúsculas e remove espaços extras
- Remove acentos e caracteres especiais nas bordas
- Remove o `s` final (pluralização), com exceções para comandos que terminam em `s` por natureza
- Ignora mensagens entre aspas, com `>` (citações do WhatsApp) ou contendo texto além do comando

### Sistema de aliases

Cada família de comandos possui um `Map` de aliases que resolve nomes alternativos para o comando canônico antes da busca na tabela principal. Por exemplo, `/gafanhoto`, `/esperanca` e `/orthoptera` apontam para a mesma entrada (`/grilo`). Isso mantém os dados de configuração limpos e sem duplicação.

### Controle de spam

O bot registra o timestamp do último comando por usuário. Comandos enviados em menos de **3** segundos pelo mesmo remetente são ignorados silenciosamente.

---

## Licença

Consulte o campo `license` no [`package.json`](https://github.com/GianllucaLeme/Bot_iNaters/blob/main/package.json).

---

<sub>Desenvolvido para uso privado em grupos de WhatsApp.</sub>
