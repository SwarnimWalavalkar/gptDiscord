import * as Discord from "discord.js";
import { Client, Message, CommandInteraction } from "discord.js";

import config from "../config";

import { DEFAULT_ERR_MSG } from "./chat";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai";
import getChatCompletion from "../gpt";

const {
  MAX_THREAD_CONTEXT,
  MAX_TEXT_LENGTH,
  OPENAI_API_MODEL,
  OPENAI_API_MAX_TOKEN,
} = config;

const color = "#FFFFFF";

export const name = "journal";
export const aliases = ["j"];
export const showHelp = false;
export const description = "Journal";
export const options = [];

const DEFAULT_CHAT_PROMPT =
  "You are Socrates, please help me with an issue in my life. Please ask me questions to try to understand what my issue is and help me unpack it. You can start the conversation however you feel is best.";

export const execute = async (
  client: Client,
  message: Message,
  args: string[]
) => {
  if (!args[0] || args[0] === "")
    return message.reply({
      content: `❌ | Please enter valid message.`,
      allowedMentions: { repliedUser: false },
    });

  if (args.join().length > MAX_TEXT_LENGTH)
    return message.reply({
      content: `❌ | Message length must not exceed ${MAX_TEXT_LENGTH}.`,
      allowedMentions: { repliedUser: false },
    });

  const prefixString = client.config.prefix + aliases;
  let requestMessage = "";
  let hasReply = message.reference || null;

  try {
    let cacheReply = [];
    let currentMsg = message;

    // Find the previous MAX_THREAD_CONTEXT reply messages
    let count = 0;
    while (hasReply !== null && count < MAX_THREAD_CONTEXT) {
      let relpyMsg = await currentMsg.fetchReference();
      cacheReply.push(relpyMsg);

      currentMsg = relpyMsg;
      hasReply = currentMsg.reference || null;
      count++;
    }

    // filter reply content prefix and doesn't start with the prefix content
    let filterReply = cacheReply
      .reverse()
      .filter(
        (msg) =>
          msg.author.bot !== true &&
          msg.content.startsWith(`${prefixString}`) &&
          msg.content !== message.content
      )
      .map((msg) =>
        String(msg.content.split(" ").splice(1)).replaceAll(",", " ")
      );

    // count total numbers of char, if > MAX_TEXT_LENGTH discard first reply message
    let textLength = filterReply.reduce((acc, str) => acc + str.length, 0);
    while (textLength > MAX_TEXT_LENGTH) {
      filterReply.shift();
      textLength = filterReply.reduce((acc, str) => acc + str.length, 0);
    }

    // Add filtered reply messages to requestMessage
    requestMessage += filterReply.join("\n") + "\n";
  } catch (error) {
    console.error("ChatGPT: Search reply error", error);
  }

  // Add current message content to requestMessage
  requestMessage += args.join(" ");

  try {
    let result = await getResponse(requestMessage);

    if (result === "") result = DEFAULT_ERR_MSG; // Discord can't send empty message

    result =
      result.length >= 1950 ? result.substring(0, 1950) + " ..." : result; // Discord can't send over 2000 length string

    console.log(`Journal Response Sent.`);
    return message.reply({
      content: result,
      allowedMentions: { repliedUser: false },
    });
  } catch (error) {
    console.log(`Journal Response error.`);
    console.log(error);
    let result = DEFAULT_ERR_MSG;
    return message.reply({
      content: result,
      allowedMentions: { repliedUser: false },
    });
  }
};

export const slashExecute = async (_, interaction: CommandInteraction) => {
  return interaction.editReply({
    content:
      "💡 | The Journal Feature is best used as a message interaction, please use the `?j` syntax.",
    allowedMentions: { repliedUser: false },
  });
};

const getResponse = async (message) => {
  const messages: Array<ChatCompletionRequestMessage> = [
    { role: "user", content: DEFAULT_CHAT_PROMPT },
    { role: "user", content: message },
  ];

  const completionRequest: CreateChatCompletionRequest = {
    model: OPENAI_API_MODEL,
    max_tokens: OPENAI_API_MAX_TOKEN,
    messages,
  };

  return await getChatCompletion(completionRequest);
};
