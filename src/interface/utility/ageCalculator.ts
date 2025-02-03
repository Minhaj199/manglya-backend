

export const getAge=(birthDate:Date)=>{
    
 const currentDate=new Date()
 let year:number=birthDate.getFullYear()-currentDate.getFullYear()
 if(currentDate.getMonth()<birthDate.getMonth()||currentDate.getMonth()===birthDate.getMonth()&&currentDate.getDate()<birthDate.getDate()){
    year--
 }
return Math.abs(year)
}