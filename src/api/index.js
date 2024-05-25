import axios from "axios";
const BACK_BASE_URL = process.env.REACT_APP_BACK_URL;

export const sendResultImage = async (gender, formData) => {
    const url =
        gender === "MALE" ? `${BACK_BASE_URL}/measurements/upload/male` : `${BACK_BASE_URL}/measurements/upload/female`;

    const response = await axios
        .post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            console.log("TEST" + res);
            return response;
        });
};
