/* Importador del libro CA4: datos privados procesados solo en el navegador. */
(function(root){
'use strict';
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const num=x=>typeof x==='number'&&Number.isFinite(x)?x:0;
const cents=x=>Math.round(x*100)/100;
const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function value(cell){const v=cell?.value;if(v==null)return null;if(v instanceof Date)return v.toISOString().slice(0,10);if(typeof v==='object'){if('formula'in v||'sharedFormula'in v)return v.result??null;if(v.richText)return v.richText.map(x=>x.text).join('');return v.text??null;}return v;}
function build(wb,fileName){
 const ops={countries:[{id:'HN',name:'Honduras'},{id:'GT',name:'Guatemala'},{id:'ESV',name:'El Salvador'},{id:'NI',name:'Nicaragua'}],budgets:[],campaigns:[],sets:[],brands:[],results:[]};
 const analysis={version:1,imports:[],manual:[],plans:[],bookMeta:{file:fileName,imported:new Date().toISOString()}};
 const notices=[],campaigns=new Map(),sets=new Map();let counter=0;
 const id=prefix=>'book-'+prefix+'-'+(++counter);
 const start=wb.getWorksheet('Inicio');if(!start)throw Error('No se reconoce el libro: falta la hoja Inicio.');
 const year=String(value(start.getCell('B2'))||'').match(/20\d{2}/)?.[0];if(!year)throw Error('No se encontró el año del informe.');
 function get(sheet,r,c){return value(sheet.getCell(r,c));}
 function period(m){const at=months.indexOf(norm(m));if(at<0)throw Error('Mes no reconocido en el libro: '+m);return year+'-'+String(at+1).padStart(2,'0');}
 function addCampaign(country,month,name,objective,scenario,basis){const key=JSON.stringify([country,month,name,objective,scenario]);if(!campaigns.has(key)){const c={id:id('campaign'),country,month,name,objective,amount:0,active:true,scenario,budgetBasis:basis,sourceFile:fileName};campaigns.set(key,c);ops.campaigns.push(c);}return campaigns.get(key);}
 function addSet(c,name,category,own=0,brand=0,synthetic=false){const key=JSON.stringify([c.id,name,category]);if(!sets.has(key)){const s={id:id('set'),campaign:c.id,name,category,assigned:'No indicado en el archivo',own:0,brand:0,sourceFile:fileName,synthetic};sets.set(key,s);ops.sets.push(s);}const s=sets.get(key);s.own=cents(s.own+own);s.brand=cents(s.brand+brand);return s;}
 function addResult(s,month,ad,r){ops.results.push({id:id('result'),set:s.id,date:month+'-01',period:month,periodOnly:true,ad,spend:r.amount,clicks:r.clicks||0,messages:r.messages||0,purchases:r.purchases||0,value:0,valueKnown:false,sourceFile:fileName,sourceRow:r.sourceRow,missingMetrics:r.missingMetrics||[]});}
 function historical(country,month,entry){const synthetic=!entry.campaign||!entry.set;const campaignName=entry.campaign||'Sin nombre en archivo · '+entry.objective;const setName=entry.set||'Sin conjunto en archivo · '+entry.category;const c=addCampaign(country,month,campaignName,entry.objective,'real','actual-spend');const s=addSet(c,setName,entry.category,entry.amount,0,synthetic);addResult(s,month,entry.ad||'Sin nombre de anuncio',entry);}
 const byMonth=new Map();
 function imported(kind,country,month,row,sheet){const key=[kind,country,month].join('|');if(!byMonth.has(key)){const x={id:id('import'),kind,country,month,file:fileName,sheet,hash:'full-book',created:new Date().toISOString(),currency:'USD',rate:1,rows:[]};byMonth.set(key,x);analysis.imports.push(x);}byMonth.get(key).rows.push(row);}
 for(const [code,country]of [['HN','HN'],['GT','GT'],['SV','ESV']]){
  const ads=wb.getWorksheet('Anuncios '+code),sales=wb.getWorksheet('Ventas '+code);if(!ads||!sales)throw Error('Falta Anuncios o Ventas de '+code+'.');
  for(let r=4;r<=ads.rowCount;r++){const monthName=get(ads,r,1);if(!monthName||norm(monthName).includes('total'))continue;const month=period(monthName),raw=get(ads,r,8);if(typeof raw!=='number')throw Error(`Anuncios ${code}, fila ${r}: inversión sin valor numérico.`);const entry={category:String(get(ads,r,7)||'Sin categoría'),campaign:String(get(ads,r,2)||''),set:String(get(ads,r,3)||''),ad:String(get(ads,r,4)||''),objective:String(get(ads,r,6)||'Otros'),amount:cents(raw),purchases:num(get(ads,r,9)),messages:num(get(ads,r,10)),visits:num(get(ads,r,11)),clicks:num(get(ads,r,12)),sourceRow:r};historical(country,month,entry);imported('ads',country,month,entry,ads.name);}
  for(let r=4;r<=sales.rowCount;r++){const monthName=get(sales,r,1);if(!monthName||norm(monthName).includes('total'))continue;const raw=get(sales,r,6);if(typeof raw!=='number')throw Error(`Ventas ${code}, fila ${r}: falta el resultado guardado en USD.`);const ch=norm(get(sales,r,2)),channel=ch==='call center'?'Call Center':ch==='retail'?'Retail':ch==='web'?'Web':'Otros';imported('sales',country,period(monthName),{category:String(get(sales,r,4)||'Sin categoría'),subcategory:String(get(sales,r,3)||''),channel,amount:cents(raw),sourceRow:r},sales.name);}
 }
 // Las ventas web del libro están en los resúmenes de país, no en Ventas CC/Retail.
 for(const [title,country]of [['HN · Honduras','HN'],['GT · Guatemala','GT'],['SV · El Salvador','ESV']]){
  const sheet=wb.getWorksheet(title);let webRow=0;
  for(let r=1;r<=sheet.rowCount;r++)if(norm(get(sheet,r,1))==='venta web en usd'){webRow=r;break;}
  if(webRow)for(let j=0;j<4;j++){const amount=get(sheet,webRow,2+j*3);if(typeof amount==='number')imported('sales',country,year+'-'+String(7+j).padStart(2,'0'),{category:'Venta web · sin desglose por categoría',subcategory:'Total web del mes · no atribuible por categoría',channel:'Web',amount:cents(amount),sourceRow:webRow},sheet.name+' · ventas web');}
 }
 const ni=wb.getWorksheet('NI · Nicaragua');if(!ni)throw Error('Falta la hoja de Nicaragua.');
 for(let col=2;col<=5;col++){const month=period(get(ni,5,col));for(const [r,label,obj]of [[7,'Escolar (mensajes)','Mensajes'],[8,'Tiendas (alcance)','Alcance y tiendas'],[9,'Vacantes RRHH (alcance)','RRHH (empleo)']]){const amount=cents(num(get(ni,r,col)));const entry={category:label,campaign:'Resumen mensual · '+label,set:'Resumen mensual · sin detalle de conjuntos',ad:'Resumen del mes · no es un anuncio individual',objective:obj,amount,messages:r===7?num(get(ni,10,col)):0,purchases:0,visits:0,clicks:0,sourceRow:r,missingMetrics:['clicks','purchases','value'],aggregate:true};historical('NI',month,entry);imported('ads','NI',month,entry,ni.name);}}
 notices.push('Nicaragua no incluye ventas ni detalle de anuncios por mes: se importan los resúmenes mensuales, sin repartir los anuncios acumulados julio–octubre artificialmente.');
 const objectives=['Mensajes','Tráfico','Conversiones web','Otros'];
 function plan(country,month,category,objective,amount,scenario,note,sourceSheet,sourceRow){if(typeof amount!=='number'||!Number.isFinite(amount))return;const a=cents(amount);const record={id:id('plan'),country,month,category,objective,amount:a,note:note||'',updated:new Date().toISOString(),sourceSheet,sourceRow,source:scenario==='lester'?'Lester':scenario==='claude'?'Claude':'Neno'};if(scenario==='lester')analysis.manual.push(record);else analysis.plans.push(record);const c=addCampaign(country,month,objective+' · '+record.source,objective,scenario,'planned');const set=addSet(c,category,category,a);if(scenario==='lester')set.manualId=record.id;}
 for(const [title,country]of [['HN · Honduras','HN'],['GT · Guatemala','GT'],['SV · El Salvador','ESV']]){const sheet=wb.getWorksheet(title);if(!sheet)throw Error('Falta '+title);let header=0;for(let r=1;r<=sheet.rowCount;r++)if(norm(get(sheet,r,1))==='categoria'&&norm(get(sheet,r,47))==='mensajes'){header=r;break;}if(!header)throw Error('No se encontraron las columnas de presupuesto en '+title);let end=header+1;while(end<=sheet.rowCount&&norm(get(sheet,end,1))!=='total')end++;if(end>sheet.rowCount)throw Error('No se encontró el total de presupuesto de '+title);for(let r=header+1;r<end;r++){const category=get(sheet,r,1);if(!category)continue;const lesterNote=[get(sheet,r,65),get(sheet,r,73)].filter(Boolean).join('\n');for(let j=0;j<4;j++){plan(country,year+'-11',String(category),objectives[j],get(sheet,r,47+j),'lester',lesterNote,title,r);plan(country,year+'-11',String(category),objectives[j],get(sheet,r,54+j),'claude',String(get(sheet,r,73)||''),title,r);plan(country,year+'-12',String(category),objectives[j],get(sheet,r,59+j),'claude',String(get(sheet,r,73)||''),title,r);plan(country,year+'-11',String(category),objectives[j],get(sheet,r,86+j),'neno',String(get(sheet,r,95)||''),title,r);plan(country,year+'-12',String(category),objectives[j],get(sheet,r,91+j),'neno',String(get(sheet,r,95)||''),title,r);}}}
 for(let r=49;r<=57;r++){const category=String(get(ni,r,1)||''),obj=r===49||r>=52?'Mensajes':'Otros';plan('NI',year+'-11',category,obj,get(ni,r,4),'lester',String(get(ni,r,7)||''),ni.name,r);for(const [col,month]of [[5,'11'],[6,'12']])plan('NI',year+'-'+month,category,obj,get(ni,r,col),'claude',String(get(ni,r,7)||''),ni.name,r);for(let j=0;j<4;j++){plan('NI',year+'-11',category,objectives[j],get(ni,r,14+j),'neno',String(get(ni,r,23)||''),ni.name,r);plan('NI',year+'-12',category,objectives[j],get(ni,r,19+j),'neno',String(get(ni,r,23)||''),ni.name,r);}}
 notices.push('Diciembre contiene propuestas Claude/Neno, pero no un presupuesto Lester aprobado. Nicaragua tampoco tiene presupuesto Lester de noviembre llenado. No se inventan ni se aprueban esos importes.');
 for(const [code,country]of [['HN','HN'],['GT','GT'],['SV','ESV']]){const sheet=wb.getWorksheet('Fondos de marca '+code);if(!sheet)continue;for(let r=7;r<=sheet.rowCount;r++){const brand=get(sheet,r,1),category=get(sheet,r,2);if(!brand||!category||norm(brand)==='total')continue;for(let m=1;m<=12;m++)for(let j=0;j<4;j++){const a=get(sheet,r,3+(m-1)*4+j);if(typeof a!=='number'||a===0)continue;const objective=['Mensajes','Conversiones web','Tráfico','Otros'][j],month=year+'-'+String(m).padStart(2,'0');ops.brands.push({id:id('brand'),country,month,name:String(brand).trim(),category:String(category),objective,amount:cents(a),sourceFile:fileName});for(const scenario of ['lester','claude','neno']){if(!ops.campaigns.some(c=>c.country===country&&c.month===month&&c.scenario===scenario))continue;const c=addCampaign(country,month,objective+' · '+({lester:'Lester',claude:'Claude',neno:'Neno'}[scenario]),objective,scenario,'planned');addSet(c,String(category),String(category),0,cents(a));}}}}
 // El archivo no exporta un estado activo/inactivo. Actividad mensual inferida.
 for(const c of ops.campaigns){const ss=ops.sets.filter(s=>s.campaign===c.id),ids=new Set(ss.map(s=>s.id));c.active=ss.some(s=>s.own+s.brand>0)||ops.results.some(r=>ids.has(r.set)&&(r.spend>0||r.clicks>0||r.messages>0||r.purchases>0));c.activitySource='inferred-from-data';}
 notices.push('La actividad histórica se determina por inversión o resultados en ese mes; no es una consulta del estado actual de Meta. Los nombres de campañas/conjuntos ausentes quedan indicados, sin inventar nombres reales.');
 const raw=wb.worksheets.map(sheet=>{const rows=[];sheet.eachRow({includeEmpty:true},r=>{const cells=[];r.eachCell({includeEmpty:true},(c,n)=>cells[n-1]=value(c));rows[r.number-1]=cells;});return {name:sheet.name,rows};});
 // Verificar componentes contra los totales guardados del propio archivo.
 const checks=[];
 for(const [title,country]of [['HN · Honduras','HN'],['GT · Guatemala','GT'],['SV · El Salvador','ESV']]){
  const sheet=wb.getWorksheet(title);let totalRow=0;
  for(let r=1;r<=sheet.rowCount;r++)if(norm(get(sheet,r,1))==='total'&&typeof get(sheet,r,51)==='number'){totalRow=r;break;}
  if(!totalRow)throw Error('No se pudo verificar el total del presupuesto en '+title);
  for(const [scenario,month,column]of [['lester','11',51],['claude','11',58],['claude','12',63],['neno','11',85],['neno','12',90]]){
   const ids=new Set(ops.campaigns.filter(c=>c.country===country&&c.month===year+'-'+month&&c.scenario===scenario).map(c=>c.id));
   const actual=cents(ops.sets.filter(s=>ids.has(s.campaign)).reduce((n,s)=>n+s.own,0)),expected=get(sheet,totalRow,column);
   if(typeof expected!=='number'||Math.abs(actual-expected)>0.011)throw Error('No cuadra el total '+scenario+' '+country+' '+month+'. No se aplicó la carga.');
   checks.push({country,month:year+'-'+month,scenario,total:actual,verified:true});
  }
 }
 const sourceMeta={file:fileName,year,imported:new Date().toISOString(),notices,checks};ops.bookMeta=sourceMeta;analysis.bookMeta=sourceMeta;
 return {ops,analysis,raw,notices,summary:{campaigns:ops.campaigns.length,sets:ops.sets.length,results:ops.results.length,sales:analysis.imports.filter(x=>x.kind==='sales').reduce((n,x)=>n+x.rows.length,0),manual:analysis.manual.length,proposals:analysis.plans.length,months:[...new Set(ops.campaigns.map(c=>c.month))].sort()}};
}
root.ACOSABook={build};if(typeof module!=='undefined')module.exports={build};
})(typeof window==='undefined'?globalThis:window);
