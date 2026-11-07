export function loginPolicy(url){
 const callback=url.pathname==='/sign-in'&&url.searchParams.has('neon_auth_session_verifier');
 return callback?{loginUrl:'/',publicRoutes:['/sign-in']}:{loginUrl:'/sign-in',publicRoutes:['/','/sign-in']};
}
