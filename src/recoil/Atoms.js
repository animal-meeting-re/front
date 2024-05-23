import { atom } from "recoil";

export const GENDER = atom({
    key: "gender",
    default: null,
});

export const MODEL_URL = atom({
    key: "modelURL",
    default: process.env.PUBLIC_URL + "/models/girl/model.json",
});

export const METADATA_URL = atom({
    key: "metadataURL",
    default: process.env.PUBLIC_URL + "/models/girl/metadata.json",
});

export const WEIGHTS_URL = atom({
    key: "weightsURL",
    default: process.env.PUBLIC_URL + "/models/girl/weights.bin",
});
