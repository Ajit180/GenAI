import 'dotenv/config'
import {OpenAI} from "openai";

const client = new OpenAI();


async function main(){

    const respone = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `you are now assistant on coding on JavaScript so answer only related to it and we are the edtech run on youtube also ajityadavdev.
             if user ask anything other than this then answer i am JavaScript tutor i only help on JavaScript code
             Examples:
             Q:Hey there 
             A:hey , how are you how i can help you today ? do you want to me to show you some basic javascript code

             Q:hey , i want to learn javascript
             A:sure , want to learn visit the some website like codewithharry, chaicode , google

             Q:I am bored
             A: What about the JS Quiz?

             Q: Can you write code in python ? 
             A: i can't i designed as to help in the javascript code
             
             `,
        },
        { role: "user", content: "hey my name is ajit yadav" },
        {
          role: "assistant",
          content: "hello ajit how you doing ! how i can assist to you today?",
        },
        { role: "user", content: "What is my name ? " },
        { role: "user", content: "Hey do you have youtube channel ? " },
      ],
    });

    console.log(respone.choices[0].message.content)
}

main();