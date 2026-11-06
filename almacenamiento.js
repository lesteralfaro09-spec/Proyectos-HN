/* Compatible con datos JSON anteriores; compresión local para libros completos. */
(function(){
 const prefix='ACOSA-LZ1:';
 window.ACOSAStorage={
  read(key){const raw=localStorage.getItem(key);if(raw===null)return null;const json=raw.startsWith(prefix)?LZString.decompressFromUTF16(raw.slice(prefix.length)):raw;if(json===null)throw Error('No se pudo leer el respaldo local.');return JSON.parse(json);},
  write(key,data){const json=JSON.stringify(data);localStorage.setItem(key,json.length>100000?prefix+LZString.compressToUTF16(json):json);},
  async storeBook(book){return new Promise((resolve,reject)=>{const open=indexedDB.open('acosa-original-book',1);open.onupgradeneeded=()=>open.result.createObjectStore('books');open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result,t=db.transaction('books','readwrite');t.objectStore('books').put(book,'current');t.oncomplete=()=>{db.close();resolve();};t.onerror=()=>{db.close();reject(t.error);};};});},
  async readBook(){return new Promise((resolve,reject)=>{const open=indexedDB.open('acosa-original-book',1);open.onupgradeneeded=()=>open.result.createObjectStore('books');open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result,t=db.transaction('books'),r=t.objectStore('books').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);t.oncomplete=()=>db.close();};});}
 };
})();
