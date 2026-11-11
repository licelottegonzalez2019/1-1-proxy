const APP = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>1+1 Proxy</title>
<style>
body{background:#0b1020;color:white;font-family:Arial;display:grid;place-items:center;min-height:100vh}
main{background:#151d32;padding:30px;border-radius:20px;width:85%;max-width:600px}
input{padding:14px;width:65%;border-radius:10px}
button{padding:14px;background:#4778ff;color:white;border:0;border-radius:10px}
</style>
</head>
<body><main>
<h1>1+1 Proxy</h1>
<form id="go">
<input id="address" placeholder="https://ejemplo.com">
<button>Abrir</button>
</form>
<script>
document.querySelector('form').onsubmit=e=>{
e.preventDefault();
let u=document.querySelector('#address').value;
if(!/^https?:\\/\\//i.test(u))u='https://'+u;
location.href='/proxy?url='+encodeURIComponent(u);
};
</script>
</main></body></html>`;

export default {
 async fetch(request, env) {
  const u=new URL(request.url);
  if(u.pathname==='/') return new Response(APP,{
   headers:{'content-type':'text/html;charset=UTF-8'}
  });

  if(u.pathname!='/proxy') return new Response('Not found',{status:404});

  let target;
  try{target=new URL(u.searchParams.get('url'))}
  catch{return new Response('URL inválida',{status:400})}

  if(!['http:','https:'].includes(target.protocol))
   return new Response('Destino no permitido',{status:403});

  const host=target.hostname.toLowerCase();
  if(host==='localhost'||host.endsWith('.localhost')||
     host.endsWith('.local')||
     /^(127\.|10\.|192\.168\.|169\.254\.)/.test(host))
   return new Response('Destino bloqueado',{status:403});

  try{
   const response=await fetch(target.href,{
    headers:{'User-Agent':'Mozilla/5.0'}
   });
   const headers=new Headers(response.headers);
   headers.delete('content-security-policy');
   headers.delete('x-frame-options');
   return new Response(response.body,{
    status:response.status,
    headers
   });
  }catch{
   return new Response('No se pudo cargar la página',{status:502});
  }
 }
};
