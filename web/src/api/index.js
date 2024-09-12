import axios from "axios";
const BACK_BASE_URL = process.env.REACT_APP_BACK_URL;

export const sendResultImage = async (userGender, formData) => {
    const url =
        userGender === "MALE"
            ? `${BACK_BASE_URL}/measurements/upload/male`
            : `${BACK_BASE_URL}/measurements/upload/female`;
    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("오류 발생:", error);
        throw error;
    }
};
