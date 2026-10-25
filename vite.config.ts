import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {getContributionResponse} from './server/contributions.mjs';
export default defineConfig({plugins:[react(),tailwindcss(),{
 name:'local-contribution-api',
 configureServer(server){
  server.middlewares.use('/api/github-contributions',async(request,response)=>{
   if(request.method!=='GET'){response.statusCode=405;response.end();return}
   const result=await getContributionResponse();
   response.statusCode=result.status;
   result.headers.forEach((value,key)=>response.setHeader(key,value));
   response.end(await result.text());
  });
 },
}]});
