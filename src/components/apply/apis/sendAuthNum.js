import axios from "axios";
const BACK_BASE_URL = process.env.REACT_APP_BASE_URL;

export const SendAuthNum = async (phoneNum) => {
  const requestData = {
    phoneNumber: phoneNum,
  };
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/users/auth/phone/request-code`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("오류 발생:", error);
    throw error;
  }
};
