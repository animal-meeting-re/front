import animalTypes from "./animalTypes.json";

export const getAnimalTypeByGender = (gender) => {
    if (gender === "MALE") {
        return animalTypes.male.animalTypes;
    } else if (gender === "FEMALE") {
        return animalTypes.female.animalTypes;
    } else {
        throw new Error("Invalid gender");
    }
};

export const getAnimalTypeDetails = (gender, type) => {
    const animalTypes = getAnimalTypeByGender(gender);
    const animalType = animalTypes.find((animal) => animal.type === type);

    if (!animalType) {
        throw new Error("Animal type not found");
    }

    return animalType;
};

export const getAnimalTypeDetailsByIndex = (gender, index) => {
    const animalTypes = getAnimalTypeByGender(gender);

    if (index < 0 || index >= animalTypes.length) {
        throw new Error("Index out of range");
    }

    return animalTypes[index];
};

export const getAnimalTypeByIndex = (gender, index) => {
    const animalDetails = getAnimalTypeDetailsByIndex(gender, index);
    return animalDetails.type;
};
