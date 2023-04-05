interface Config {
  DISCORD_TOKEN: string;
  OPENAI_API_TOKEN: string;
  OPENAI_API_MODEL: "gpt-3.5-turbo";
  OPENAI_API_MAX_TOKEN: number;
  OPENAI_TIMEOUT: number;
  MAX_THREAD_CONTEXT: number;
  MAX_TEXT_LENGTH: number;
}
export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  OPENAI_API_TOKEN: process.env.OPENAI_API_TOKEN,
  OPENAI_API_MODEL: "gpt-3.5-turbo",
  OPENAI_API_MAX_TOKEN: 1024,
  OPENAI_TIMEOUT: 30,
  MAX_THREAD_CONTEXT: 5,
  MAX_TEXT_LENGTH: 1000,
} as Config;
