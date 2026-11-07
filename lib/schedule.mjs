export const scheduleLabelSchema={type:'string',minLength:1,maxLength:149,description:'A short, truthful schedule and latest-run status; at most 149 characters.'};

export function validateScheduleLabel(value){
 if(typeof value!=='string'||!value.trim()||value.length>scheduleLabelSchema.maxLength){
  throw new Error('Schedule label must contain 1–149 characters. Shorten it and retry; do not rerun source checks.');
 }
 return value.trim();
}
