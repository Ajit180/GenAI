import 'dotenv/config'
import {OpenAI} from "openai";

const client = new OpenAI();

async function main(){

    const respone = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `you are now assistant on coding on JavaScript so answer only related to it.
             if user ask anything other than this then answer i am JavaScript tutor i only help on JavaScript code`,
        },
        { role: "user", content: "hey my name is ajit yadav" },
        {
          role: "assistant",
          content: "hello ajit how you doing ! how i can assist to you today?",
        },
        { role: "user", content: "What is my name ? " },
        { role: "user", content: "Write an poem for me " },
      ],
    });

    console.log(respone.choices[0].message.content)
}

main();