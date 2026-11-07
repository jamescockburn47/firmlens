'use client';
import {useEffect,useState} from 'react';
import {createAuthClient} from '@neon/auth/next';
const client=createAuthClient();
export default function SignIn(){
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{
  if(!new URLSearchParams(window.location.search).has('sig'))return;
  let cancelled=false;
  client.getSession().then(async({data,error})=>{
   if(cancelled)return;
   if(error){setMessage('Could not check your session. Please retry.');return;}
   if(data?.user){setBusy(true);const result=await client.oauth2.continue({selected:true});
    if(result.error){setMessage(result.error.message||'Could not continue the connection.');setBusy(false);}}
  }).catch(()=>{if(!cancelled){setMessage('Could not continue the connection. Please retry.');setBusy(false);}});
  return ()=>{cancelled=true;};
 },[]);
 async function signIn(){setBusy(true);setMessage('');try{
  const result=await client.signIn.social({provider:'google',callbackURL:'/'});
  if(result.error)setMessage(result.error.message||'Sign-in failed.');
 }catch{setMessage('The sign-in service could not be reached. Please retry.');}finally{setBusy(false);}}
 return <main className="page-shell" style={{maxWidth:600,paddingTop:50}}><a href="/">← Back to the public tracker</a><h1 style={{fontSize:36,marginTop:30}}>Owner sign in</h1><p>Browsing needs no account. This page is for the person maintaining FirmLens.</p><button className="button primary" disabled={busy} onClick={()=>void signIn()}>{busy?'Opening sign-in…':'Continue with Google'}</button><p role="status">{message}</p><p>Use the Google account registered as the FirmLens owner. Signing in with another account does not grant editing access.</p></main>;
}
