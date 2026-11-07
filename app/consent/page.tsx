'use client';
import {useState,useEffect} from 'react';
import {createAuthClient} from '@neon/auth/next';
const auth=createAuthClient();
export default function Consent(){
 const [name,setName]=useState(''),[scope,setScope]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [destination,setDestination]=useState(''),[resource,setResource]=useState(''),[clientId,setClientId]=useState('');
 useEffect(()=>{const p=new URLSearchParams(window.location.search);setResource(p.get('resource')||'Not specified');setClientId(p.get('client_id')||'');try{const u=new URL(p.get('redirect_uri')||'');setDestination(u.origin);}catch{setError('The callback address is invalid.');}},[]);
 useEffect(()=>{const p=new URLSearchParams(window.location.search);setScope(p.get('scope')||'');auth.oauth2.publicClient({query:{client_id:p.get('client_id')||''}}).then(({data,error})=>{if(error||!data)setError('Could not verify the requesting application.');else setName(data.client_name||'Application');}).catch(()=>setError('Could not reach the sign-in service.'));},[]);
 async function answer(accept:boolean){setBusy(true);try{const result=await auth.oauth2.consent({accept});if(result.error)setError(result.error.message||'Could not record your choice.');}catch{setError('Could not record your choice.');}finally{setBusy(false);}}
 return <main className="page-shell" style={{maxWidth:680,paddingTop:50,overflowWrap:'anywhere'}}><h1 style={{fontSize:36}}>Connect to FirmLens</h1><p>{name||'Checking the application…'}</p><p>Client identifier: {clientId}</p><p>Return address: {destination}</p><p>A localhost or 127.0.0.1 return address belongs to software on your computer. The client name alone does not prove who built it.</p><p>Resource: {resource}</p><p>Requested identity permissions: {scope||'Checking…'}</p><p>This connection can read public records. If you are the configured owner, its tools can also check sources and save AI summaries on your behalf.</p><p>Approve only an application you intended to connect. App instructions and source documents cannot grant editing rights.</p><button className="button primary" disabled={!name||!!error||busy} onClick={()=>void answer(true)}>Allow connection</button> <button className="button" disabled={!name||busy} onClick={()=>void answer(false)}>Deny</button><p role="alert">{error}</p></main>;
}
