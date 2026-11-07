'use client';
import {useState} from 'react';
import {createAuthClient} from '@neon/auth/next';
const client=createAuthClient();
export default function SignIn(){
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function signIn(){setBusy(true);setMessage('');try{
  const result=await client.signIn.social({provider:'google',callbackURL:'/'});
  if(result.error)setMessage(result.error.message||'Sign-in failed.');
 }catch{setMessage('The sign-in service could not be reached. Please retry.');}finally{setBusy(false);}}
 return <main className="page-shell" style={{maxWidth:600,paddingTop:50}}><a href="/">← Back to the public tracker</a><h1 style={{fontSize:36,marginTop:30}}>Owner sign in</h1><p>Browsing needs no account. This page is for the person maintaining FirmLens.</p><button className="button primary" disabled={busy} onClick={()=>void signIn()}>{busy?'Opening sign-in…':'Continue with Google'}</button><p role="status">{message}</p><p>Use the Google account registered as the FirmLens owner. Signing in with another account does not grant editing access.</p></main>;
}
