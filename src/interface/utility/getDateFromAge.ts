
export function getDateFromAge(minAge:number,maxAge:number){
    const currntDate=new Date()
    const birthMinAge=currntDate.getFullYear()-minAge
    const birthMaxAge=currntDate.getFullYear()-maxAge
    const minAgeDate=new Date(birthMinAge,currntDate.getMonth(),currntDate.getDay())
    const maxAgeDate=new Date(birthMaxAge,currntDate.getMonth(),currntDate.getDay())
    return {minAgeDate,maxAgeDate} 
}