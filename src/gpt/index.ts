import config from "../config";

import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const {
  OPENAI_API_TOKEN,
  OPENAI_API_MODEL,
  OPENAI_API_MAX_TOKEN,
  OPENAI_TIMEOUT,
} = config;

const configuration = new Configuration({
  apiKey: String(OPENAI_API_TOKEN),
});

const openai = new OpenAIApi(configuration);

const chatGPT = async (message: string): Promise<any> => {
  const response = await openai.createChatCompletion(
    {
      model: OPENAI_API_MODEL,
      messages: [
        {
          role: "user",
          content:
            "You are a helpful large language model assistant built by Swarnim and Goutham powered by Open AI's GPT-3.5 Turbo model.",
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: message,
        },
      ],
      max_tokens: OPENAI_API_MAX_TOKEN,
    },
    { timeout: OPENAI_TIMEOUT * 1000 }
  );

  const result = String(response.data.choices[0].message?.content);
  return result;
};
export default chatGPT;
