import OpenAI from "openai";
import { env } from "@/config/env";
import { Logger } from "@/utils/logger";

const logger = new Logger("Config:Env");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
})

export async function POST( req: Request){
  const messages = await req.json();
  // logger.info("Received messages:", messages);

  const { model, reasoning } = await llmRouter(messages.content);

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "user",
        content: messages.content
      }
    ]

  })

  return new Response(JSON.stringify({
    messages: `Model: ${model}
    \n\n${response.choices[0].message.content}`
  }));

  async function llmRouter(message: string){
    const routingPrompt= `
      You are an expert in selecting the best LLM model for a given message.

      You are given a user's message and you need to determine which model to use to answer the message, 
      based on the following criteria:
      
      - Price
      - Latency
      - Accuracy
      - Context length
      - Model capabilities

      You have the following models available:
      <models_available>
      - model_name: openai/gpt-oss-20b:free
        gpt-oss-20b is an open-weight 21B parameter model released by OpenAI under the Apache 2.0 license. 
        It uses a Mixture-of-Experts (MoE) architecture with 3.6B active parameters per forward pass, 
        optimized for lower-latency inference and deployability on consumer or single-GPU hardware. 
        The model is trained in OpenAI’s Harmony response format and supports reasoning level configuration
        , fine-tuning, and agentic capabilities including function calling, tool use, and structured 
        outputs.
        - 131,072 context window
        - price: free
        - Time to first token: 0.40s
        - Throughput: 273.2 tokens/s

      - model_name: anthropic/claude-sonnet-4
        Claude Sonnet 4 significantly enhances the capabilities of its predecessor, Sonnet 3.7, excelling in both 
        coding and reasoning tasks with improved precision and controllability. Achieving state-of-the-art performance
        on SWE-bench (72.7%), Sonnet 4 balances capability and computational efficiency, making it suitable for a broad 
        range of applications from routine coding tasks to complex software development projects. Key enhancements 
        include improved autonomous codebase navigation, reduced error rates in agent-driven workflows, and increased 
        reliability in following intricate instructions. Sonnet 4 is optimized for practical everyday use, providing
        advanced reasoning capabilities while maintaining efficiency and responsiveness in diverse internal and external 
        scenarios. Read more at the blog post here
        - 200,00 context window
        - price: $3/million input tokens, $15/millions output tokens
        - Time to first token: 20.07s
        - Throughput: 57 tokens/s

      - model_name: openai/gpt-5-mini
        GPT-5 Mini is a compact version of GPT-5, designed to handle lighter-weight reasoning tasks. It provides the same 
        instruction-following and safety-tuning benefits as GPT-5, but with reduced latency and cost. GPT-5 Mini is the
        successor to OpenAI's o4-mini model.
        - 400,000 context window
        - price: $0.25/million input tokens, $2/million output tokens
        - Time to first token: 6.84s
        - Throughput: 75.59 tokens/s
        
      </models_available>

        Route the user's message to the best model 
        based on the criteria above.

        Here is the user's message:

        <user_message>
            ${message}
        </user_message>

        You need to return the model name in the following format, keep the model name as it is:
        {
          "model": openai/gpt-oss-20b:free || anthropic/claude-sonnet-4 || openai/gpt-5-mini
          "reasoning": " 1 sentence to reasoning for the choice"
        }   
    `;
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "user",
          content: routingPrompt
        }
      ],
      response_format: {type: "json_object"},
    });

    logger.info("Generated response:", response);

    const parsedResponse = JSON.parse(response.choices[0].message.content || "{}");
    return parsedResponse;
  }
  
}