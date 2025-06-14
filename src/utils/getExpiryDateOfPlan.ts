export function GetExpiryPlan(month:number){
    const currentDate=new Date()
    const futureDate=new Date(currentDate)
    futureDate.setMonth(currentDate.getMonth()+month)
    return futureDate
}