export const getAge = (birthDate: Date) => {
  const currentDate = new Date();
  let year: number = currentDate.getFullYear()-birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    year--;
  }

  return year;
};
