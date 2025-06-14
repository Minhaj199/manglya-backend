export const generateOTP = async () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("unexptected error");
    }
  }
};
