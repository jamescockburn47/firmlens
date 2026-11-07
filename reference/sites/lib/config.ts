import { env } from "cloudflare:workers";
export function config(){
 const values=env as unknown as Record<string,unknown>;
 if(!values.DB)throw new Error("Database unavailable");
 return {db:values.DB as D1Database,owner:typeof values.OWNER_EMAIL==="string"?values.OWNER_EMAIL.toLowerCase():""};
}
