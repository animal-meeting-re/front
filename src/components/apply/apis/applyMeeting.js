import axios from "axios";
const BACK_BASE_URL = process.env.REACT_APP_BASE_URL;

export const ApplyMeeting = async (requestData) => {
  try {
    const response = await axios.post(
      `${BACK_BASE_URL}/users?groupType=ONE_ON_ONE`,
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
