import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI();

//chain of thoughts
async function main() {
  const systemprompt = `
    You are an AI Assistent work on the START , THINK and OUTPUT format
    For a given user query first think and breakdown the problem into sub problems.
    you should always keep thinking and thinking before giving actual output.
    Also , before outputing the final result to user you must check once if everything is correct
    

    Rules:
     - Strictly follow the JSON format output.
     - Always follow the output in sequenc of START, THINK , and OUTPUT.
     - Always perform only one step at a time and wait for other steps.
     - Always make sure to do the multiple steps of thinking before giving output.

     Output format:
     {"step":"START | THINK | OUTPUT","content":"string"}

     Example: 
     User: Can you solve the 3 + 4 * 20 - 6 *7
     ASSISTANT: {"step" : "START" , "content": " the user want me to solve the 3 + 4 * 20 - 6 *7 math problem"}
     ASSISTANT: {"step" : "THINK" , "content": " this is the typical math problem where the bodmas formalula use for the calcualtion"}
     ASSISTANT: {"step" : "THINK" , "content": "As per the bodmas , first solve all the multiplication and divisons"}
     ASSISTANT: {"step" : "THINK" , "content": " So, first we need to solve the 4 * 20"}
     ASSISTANT: {"step" : "THINK" , "content": " Great , now equation looks like 3 + 80 -6 * 7"}
     ASSISTANT: {"step" : "THINK" , "content": " Now i can see one more multiplication to be done that is 6 * 7 = 42"}
     ASSISTANT: {"step" : "THINK" , "content": " Great , now equation looks like 3 + 80 - 42"}
     ASSISTANT: {"step" : "THINK" , "content": " As now the all the multiplication done lets do adds and substract"}
     ASSISTANT: {"step" : "THINK" , "content": " so , 3 + 80 = 83"}
     ASSISTANT: {"step" : "THINK" , "content": " new equation looks like 83-42 which is 41"}
     ASSISTANT: {"step" : "THINK" , "content": " Great all steps done now the final answer is 41"}
     ASSISTANT: {"step" : "OUTPUT" , "content": " 3 + 4 * 20 - 6 *7 =41"}

    `;

  const respone = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: systemprompt,
      },
      {
        role: "user",
        content: "user wants me to solve the 4* 18 + 78 * 67 -10",
      },
      {
        role: "assistant",
        content: JSON.stringify({
          step: "START",
          content:
            "The user wants me to solve the expression 4 * 18 + 78 * 67 - 10.",
        }),
      },
      {
        role: "assistant",
        content: JSON.stringify({
          step: "THINK",
          content:
            "This is a typical arithmetic expression where the order of operations (BODMAS/BIDMAS) must be applied: first multiplication, then addition and subtraction.",
        }),
      },
      {
        role: "assistant",
        content: JSON.stringify({
          step: "THINK",
          content:
            "According to BODMAS, I should first solve the multiplication operations: 4 * 18 and 78 * 67.",
        }),
      },
      {
        role: "assistant",
        content: JSON.stringify({
          step: "THINK",
          content: "Calculate 4 * 18 which equals 72.",
        }),
      },
      {
        role:'assistant',
        content:JSON.stringify({"step":"THINK","content":"Calculate 78 * 67 which equals 5226."})
      },
      {
        role:'assistant',
        content:JSON.stringify({"step":"THINK","content":"Now the expression becomes 72 + 5226 - 10."})
      },
      {
        role:'assistant',
        content:JSON.stringify(
            {"step":"THINK","content":"Next, perform the addition and subtraction from left to right: 72 + 5226 = 5298."}
        )
      },
      {
        role:'assistant',
        content:JSON.stringify({"step":"THINK","content":"Now the expression is 5298 - 10."})
      },
      {role:'assistant',
        content:JSON.stringify(
            {"step":"THINK","content":"Calculate 5298 - 10 which equals 5288."}
        )
      }
    ],
  });

  console.log(respone.choices[0].message.content);
}

main();
