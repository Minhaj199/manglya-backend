export const getAge = (birthDate) => {
    const currentDate = new Date();
    let year = birthDate.getFullYear() - currentDate.getFullYear();
    if (currentDate.getMonth() < birthDate.getMonth() || currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
        year--;
    }
    return Math.abs(year);
};
