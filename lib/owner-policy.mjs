export function permittedOwner(user, owner) {
 return !!user && user.emailVerified===true && typeof user.email==='string' && user.email.toLowerCase()===owner.email && (!owner.id||user.id===owner.id);
}
export function sameOrigin(request, origin) {return request.headers.get('origin')===origin;}
