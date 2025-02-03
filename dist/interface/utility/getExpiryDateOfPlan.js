export function GetExpiryPlan(month) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setMonth(currentDate.getMonth() + month);
    return futureDate;
}
