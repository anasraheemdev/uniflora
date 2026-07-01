export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  role: AssistantRole;
  content: string;
};

export type AssistantRequest = {
  slug: string;
  messages: AssistantMessage[];
};

export type AssistantResponse = {
  message: string;
  source: "openai" | "local";
};
