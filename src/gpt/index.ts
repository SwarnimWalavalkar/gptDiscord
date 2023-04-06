import config from "../config";

import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
  CreateChatCompletionRequest,
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

const getChatCompletion = async (
  completionRequest: CreateChatCompletionRequest
): Promise<any> => {
  const response = await openai.createChatCompletion(completionRequest);

  const result = String(response.data.choices[0].message?.content);
  return result;
};
export default getChatCompletion;
