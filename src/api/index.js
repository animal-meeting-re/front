import axios from "axios";
const BACK_BASE_URL = process.env.REACT_APP_BACK_URL;

export const sendResultImage = async (formData) => {
    const response = await axios
        .post(`${BACK_BASE_URL}/measurements/upload/male`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            console.log(res);
            return response;
        });
};
