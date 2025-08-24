import "dotenv/config";
import { OpenAI } from "openai";
import axios from "axios";
import {exec} from 'child_process'

const client = new OpenAI();

async function getweatherDetailsbyCityName(cityname =''){
    
    const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`

    const {data}= await axios.get(url,{responseType:'text'});
    return `The Current weather of ${cityname} is ${data}`
}
// getweatherDetailsbyCityName('pune').then((result)=>console.log(result));


async function getGithubUserInfoByUsername(username=""){
    const url = `https://api.github.com/users/${username.toLowerCase()}`
    const {data}= await axios.get(url);
    return JSON.stringify({
      login:data.login,
      id:data.id,
      user_view_type:data.user_view_type,
      follower: data.follower,
      following:data.following
    })
}

//some error while creating it 
async function executecommd(cmd=''){

  return new Promise((res,rej)=>{
    exec(cmd,(error,data)=>{
      if(error){
        return res(`Error running command ${error}`)
      }
      else{
        res(data);
      }
    })
  })
}

const   TOOL_MAP ={
    getweatherDetailsbyCityName:getweatherDetailsbyCityName,
    getGithubUserInfoByUsername:getGithubUserInfoByUsername,
    executecommd:executecommd
};

//chain of thoughts
async function main() {
  const systemprompt = `
    You are an AI Assistent work on the START , THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    you should always keep thinking and thinking before giving actual output.
    Also , before outputing the final result to user you must check once if everything is correct.
    
    you have list of availble tools that can you can call based on the query.
    
    for every tool call tools call you have made wait for the OBSERVATION from the tool which is the 
    response from the tool that you called.

    Availabe Tools:
      - getweatherDetailsbyCityName(cityname:string): Returns the current weather data from the city.
      - getGithubUserInfoByUsername(username:string): Return the public information of github user by the github api using the username.
      - executecommd(command:string): Takes linux / unix command as arg and excutes command on user machine and return the output

    Rules:
     - Strictly follow the JSON format output.
     - Always follow the output in sequenc of START, THINK,OBSERVE and OUTPUT.
     - After Every think , there is going to be an EVALAUTE step that is performed by manually someone and you need to wait for it.
     - Always perform only one step at a time and wait for other steps.
     - Always make sure to do the multiple steps of thinking before giving output.
     - For every tool call always wait for the OBSERVE which contains the output from tools

     Output format:
     {"step":"START | THINK |EVALAUTE | OUTPUT","content":"string"}

     Example: 
     User: Can you solve the 3 + 4 * 20 - 6 *7
     ASSISTANT: {"step" : "START" , "content": " the user interested in the current weather deatials about the patiala"}
     ASSISTANT: {"step" : "THINK" , "content": " let me see any availbe tool for the query"}

     ASSISTANT: {"step" : "THINK" , "content": "I see there is tool getweatherDetailsbyCityName which return current weather"}

     ASSISTANT: {"step" : "THINK" , "content": " I need to call getWeatherDeatialsbyCityName for the city patiala to get weather deatils"}
     
     ASSISTANT: {"step" : "TOOL" , "input": "patiala","tool_name":"getWeatherDeatialsbyCityName"}

     DEVELOPER: {"step" : "OBSERVE" , "content": "The weather of patila is cloudy with 27 Cel"}

     ASSISTANT: {"step" : "THINK" , "content": "Great , I got the weather details of patiala"}

     ASSISTANT: {"step" : "OUTPUT" , "content": "The weather at the patila is 27 cel with cloudy please make sure to carry an umberlla with you☔"}


    `;

    const messages =[
        {
            role:'system',
            content:systemprompt
        },
         {
        role: "user",
        content: 'push the changes to github with commit message added the agent code '
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
    content:JSON.stringify(parsecontent), // here is didn't add the , so facing the error
  })

   if(parsecontent.step==='START'){
     console.log(`🔥`,parsecontent.content);
     continue;
   }

 if(parsecontent.step==='THINK'){
     console.log(`🧠`,parsecontent.content);
     continue;
   }

   if(parsecontent.step=="TOOL"){
    const toolToCall = parsecontent.tool_name;
     if(!TOOL_MAP[toolToCall]){
      messages.push({
        role: "developer",
        content: `There is no such tool as ${toolToCall}`,
      });
      
      continue;
     }

   const responseFromTool = await  TOOL_MAP[toolToCall](parsecontent.input)
    console.log(`⛏️: ${toolToCall}(${parsecontent.input})=`,responseFromTool)
      messages.push({
        role: "developer",
        content:JSON.stringify({step:"OBSERVE","content":responseFromTool})
      });
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
