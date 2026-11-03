import vinext from 'vinext';
import { defineConfig } from 'vite';
import { readExecutionProfile } from './scripts/execution-profile.mjs';
import { configureToolEnvironment } from './scripts/tool-environment.mjs';
import { sites } from './scripts/vite/sites-vite-plugin';
export default defineConfig(async () => {
 configureToolEnvironment(process.cwd());
 const { cloudflare } = await import('@cloudflare/vite-plugin');
 return {server:readExecutionProfile()==='managed-linux'?{host:'0.0.0.0',allowedHosts:['terminal.local']}:undefined,
 plugins:[vinext(),sites({mockAuth:false}),cloudflare({viteEnvironment:{name:'rsc',childEnvironments:['ssr']},inspectorPort:false,config:{main:'./worker/index.ts',compatibility_flags:['nodejs_compat']}})]};
});
