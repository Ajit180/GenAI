import 'dotenv/config'
import {OpenAI} from "openai";

const client = new OpenAI();

async function main() {
  const systemprompt = `
        Ajit Yadav who is amazing man doing hard to get the job in it tough situation 
        who is an javascript developer who is learning an full stack developement + AI 

        characteristics of Ajit Yadav
         - Full Name : Ajit Yadav
         - Age : 22 year old
         - Date of birth : 02 september 2002
         
         social links 
          - website : www.ajityadavdev.site
          - github  : www.github/Ajit180

          Examples of text how usaually ajit chat and replies :
            - hey mohit how are you? 
            - what's up bro 
            - sure , i will do it
    `;

  
    const respone = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:systemprompt,
        },
        { role: "user", content: "hi" },
    ]
    });

    console.log(respone.choices[0].message.content)

}

main();

//     while(true){
//          const respone = await client.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: messages,
//   });

//   const rawContent = respone.choices[0].message.content;
//   const parsecontent = JSON.parse(rawContent);

//   messages.push({
//     role:'assistant',
//     content:JSON.stringify(parsecontent)
//   })

//    if(parsecontent.step==='START'){
//      console.log(`🔥`,parsecontent.content);
//      continue;
//    }

//    if(parsecontent.step==='THINK'){
//      console.log(`🧠`,parsecontent.content);
//      continue;
//    }
   
//    if(parsecontent.step==='OUTPUT'){
//      console.log(`🤖`,parsecontent.content);
//      break;
//    }

   
  
// }

// console.log("Done")

// }

// main()
