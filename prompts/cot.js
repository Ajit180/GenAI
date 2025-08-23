import "dotenv/config";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function  evaluateStep(context){
       const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});

       const prompt = `You are acting as an evaluator (LLM-as-a-Judge). 
  The assistant is solving a problem step by step in JSON format.
  
  Task:
  - Look at the latest THINK step: ${context}
  - Judge if the reasoning is correct, consistent, and on track.
  - Respond strictly in JSON format: 
    {"step":"EVALAUTE","content":"Your evaluation here"}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

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
     - Always follow the output in sequenc of START, THINK ,EVALUATE and OUTPUT.
     - After Every think , there is going to be an EVALAUTE step that is performed by manually someone and you need to wait for it.
     - Always perform only one step at a time and wait for other steps.
     - Always make sure to do the multiple steps of thinking before giving output.

     Output format:
     {"step":"START | THINK |EVALAUTE | OUTPUT","content":"string"}

     Example: 
     User: Can you solve the 3 + 4 * 20 - 6 *7
     ASSISTANT: {"step" : "START" , "content": " the user want me to solve the 3 + 4 * 20 - 6 *7 math problem"}
     ASSISTANT: {"step" : "THINK" , "content": " this is the typical math problem where the bodmas formalula use for the calcualtion"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": "As per the bodmas , first solve all the multiplication and divisons"}
      ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " So, first we need to solve the 4 * 20"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " Great , now equation looks like 3 + 80 -6 * 7"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " Now i can see one more multiplication to be done that is 6 * 7 = 42"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " Great , now equation looks like 3 + 80 - 42"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " As now the all the multiplication done lets do adds and substract"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " so , 3 + 80 = 83"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " new equation looks like 83-42 which is 41"}
     ASSISTANT: {"step" : "EVALAUTE" , "content": " Alright , Going good "}
     ASSISTANT: {"step" : "THINK" , "content": " Great all steps done now the final answer is 41"}
     ASSISTANT: {"step" : "OUTPUT" , "content": " 3 + 4 * 20 - 6 *7 =41"}

    `;

    const messages =[
        {
            role:'system',
            content:systemprompt
        },
         {
        role: "user",
        content: " write a code in javascript to find the prime number as fast as possible",
      },

    ];

    while(true){
         const respone = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: messages,
  });

  const rawContent = respone.choices[0].message.content;
  const parsecontent = JSON.parse(rawContent);

  messages.push({
    role:'assistant',
    content:JSON.stringify(parsecontent)
  })

   if(parsecontent.step==='START'){
     console.log(`🔥`,parsecontent.content);
     continue;
   }

   if(parsecontent.step==='THINK'){
     console.log(`🧠`,parsecontent.content);

     // Todo: Send the messages as history to maybe gemini and ask for a review and append it to history
      // LLM as a judge techniuqe

      const evaluation = await evaluateStep(parsecontent.content);
      console.log(`🧐 Judge:`, evaluation);

     messages.push({
      role:'developer',
      content:JSON.stringify({
        step:'EVALAUTE',
        content:evaluation,
      })
     })
     continue;
   }
   
   if(parsecontent.step==='OUTPUT'){
     console.log(`🤖`,parsecontent.content);
     break;
   }

   
  
}

console.log("Done")

}

main()
