# Discord GPT

A GPT-3.5 Powered Discord Chatbot

## Setup

### Environment Variables

```bash
# Discord App Token
DISCORD_TOKEN = ""

# OpenAI API Key
OPENAI_API_TOKEN = ""
```

## Running the bot

```bash
npm i

npm run dev
```

---

## Adding the bot to a server

Authorization URL

```
https://discord.com/api/oauth2/authorize?client_id=1091668193602457640&permissions=534723950656&scope=bot%20applications.commands
```

---

## Usage

Chatbot

```
?c <message>
```

Journal

```
?j <whatever's-on-your-mind>
```

Notes

```
/notes <topic-to-generate-notes-for>
```
