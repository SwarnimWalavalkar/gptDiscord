import { DEFAULT_ERR_MSG } from "./chat";
import config from "../config";
import { Client, CommandInteraction, Message } from "discord.js";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai";
import getChatCompletion from "../gpt";

const { MAX_TEXT_LENGTH, OPENAI_API_MODEL, OPENAI_API_MAX_TOKEN } = config;

export const name = "notes";
export const aliases = ["n"];
export const showHelp = true;
export const method = "notes <topic>";
export const description = "Generate notes on a topic";
export const options = [
  {
    name: "topic",
    description: "topic to generate notes for",
    type: 3,
    required: true,
  },
];

const DEFAULT_CHAT_PROMPT =
  "You are a helpful study assistant, What are 5 key points I should know when studying";

export const execute = async (
  client: Client,
  message: Message,
  args: string[]
) => {
  return message.reply({
    content: "Hello!",
    allowedMentions: { repliedUser: false },
  });
};

export const slashExecute = async (
  client: Client,
  interaction: CommandInteraction
) => {
  const requestMessage = String(interaction.options.get("topic", true).value);

  if (requestMessage.length > MAX_TEXT_LENGTH)
    return interaction.editReply({
      content: `❌ | Message length exceed ${MAX_TEXT_LENGTH}.`,
      allowedMentions: { repliedUser: false },
    });

  try {
    const message = `${DEFAULT_CHAT_PROMPT} ${requestMessage}`;

    let result = await getResponse(message);

    if (result === "") result = DEFAULT_ERR_MSG;

    result =
      result.length >= 1950 ? result.substring(0, 1950) + " ..." : result;

    console.log(`Notes Response Sent`);
    return interaction.editReply({
      content: result,
      allowedMentions: { repliedUser: false },
    });
  } catch (error) {
    console.error(`Notes Response Error`, error);
    let result = DEFAULT_ERR_MSG;
    return interaction.editReply({
      content: result,
      allowedMentions: { repliedUser: false },
    });
  }
};

const getResponse = async (message) => {
  const messages: Array<ChatCompletionRequestMessage> = [
    { role: "user", content: message },
  ];

  const completionRequest: CreateChatCompletionRequest = {
    model: OPENAI_API_MODEL,
    max_tokens: OPENAI_API_MAX_TOKEN,
    messages,
  };

  return await getChatCompletion(completionRequest);
};
