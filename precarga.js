/* Datos iniciales del portal publicados por petición del propietario. */
(function(){
 const OPS='acosa-demo-publica-1',ANALYSIS='acosa-analysis-v1',MARK='acosa-prefill-v1',PREVIOUS='acosa-before-prefill-v1';
 function safeRead(key){try{return ACOSAStorage.read(key);}catch{return null;}}
 window.ACOSASeed={ready:(async()=>{
  const current=safeRead(OPS),analysis=safeRead(ANALYSIS);
  if(localStorage.getItem(MARK)&&current?.bookMeta&&analysis?.bookMeta)return {ok:true,cached:true};
  const url=new URL('datos/ca4-inicial.json',document.currentScript?.src||window.location.href);
  const response=await fetch(url);
  if(!response.ok)throw Error('La carga inicial no está disponible todavía (HTTP '+response.status+'). Actualiza la página en unos minutos.');
  const seed=await response.json();
  if(!seed.version||!Array.isArray(seed.ops?.campaigns)||!Array.isArray(seed.analysis?.imports)||!Array.isArray(seed.original?.sheets))throw Error('El archivo de datos iniciales no es válido.');
  // Se sustituye la demostración, pero no se sobrescribe un libro real ya trabajado.
  const replaceOps=!current?.bookMeta,replaceAnalysis=!analysis?.bookMeta;
  const oldOps=localStorage.getItem(OPS),oldAnalysis=localStorage.getItem(ANALYSIS),oldMark=localStorage.getItem(MARK);
  if((replaceOps&&current)||(replaceAnalysis&&analysis)){
   if(!localStorage.getItem(PREVIOUS))ACOSAStorage.write(PREVIOUS,{format:'ACOSA-FULL-1',created:new Date().toISOString(),ops:current,analysis,original:await ACOSAStorage.readBook()});
  }
  try{
   if(replaceOps)ACOSAStorage.write(OPS,seed.ops);
   if(replaceAnalysis)ACOSAStorage.write(ANALYSIS,seed.analysis);
   if(replaceOps||!await ACOSAStorage.readBook())await ACOSAStorage.storeBook(seed.original);
   if(replaceOps)sessionStorage.removeItem(OPS+'-navigation');
   if(replaceAnalysis)sessionStorage.removeItem(ANALYSIS+'-navigation');
   localStorage.setItem(MARK,seed.version);
  }catch(e){
   try{if(oldOps===null)localStorage.removeItem(OPS);else localStorage.setItem(OPS,oldOps);if(oldAnalysis===null)localStorage.removeItem(ANALYSIS);else localStorage.setItem(ANALYSIS,oldAnalysis);if(oldMark===null)localStorage.removeItem(MARK);else localStorage.setItem(MARK,oldMark);}catch{}
   throw Error('No se pudo guardar la carga inicial. Los datos previos se conservan. Revisa el espacio y los permisos de almacenamiento del navegador.');
  }
  return {ok:true,cached:false};
 })().catch(error=>({ok:false,error:error.message}))};
 window.ACOSASeed.require=async function(){
  const result=await window.ACOSASeed.ready;
  if(result.ok)return;
  const main=document.querySelector('main');
  if(main){main.innerHTML='';const title=document.createElement('h1');title.textContent='No se pudo cargar la información';const detail=document.createElement('p');detail.textContent=result.error;const retry=document.createElement('button');retry.textContent='Reintentar';retry.onclick=()=>window.location.reload();main.append(title,detail,retry);}
  throw Error(result.error);
 };
})();
