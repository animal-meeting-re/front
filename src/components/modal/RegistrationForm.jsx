import React, { useEffect, useState } from "react";
import {
    Button,
    ButtonGroup,
    Modal,
    ModalTrigger,
    ModalHeader,
    ModalContent,
    ModalTitleSize,
    ModalBody,
    ModalFooter,
    ModalClose,
    FormControl,
    FormLabel,
    ButtonColorVariant,
    TextField,
    ButtonStyleVariant,
    HStack,
} from "@channel.io/bezier-react";
import ImageView from "../base/ImageView";
import ConfirmButton from "../base/ConfirmButton";
import GradientButton from "../base/GradientButton";
import { getAnimalTypeByIndex } from "../../data/animalData";
import { sendResultImage } from "../../api";
import html2canvas from "html2canvas";
import { dataURLtoBlob } from "../../utils/FileUtil";
import { RingLoader } from "react-spinners";

const RegistrationForm = (props) => {
    const [studentId, setStudentId] = useState("");
    const [resultImageUrl, setResultImageUrl] = useState("");
    const [resultImageFile, setResultImageFile] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        if (!props.showRotatingImage) {
            screenshot();
        }
    }, [props.showRotatingImage]);

    async function screenshot() {
        const canvas = await html2canvas(document.body);
        const screenshot = canvas.toDataURL("image/jpeg");
        const animalPhotoBlob = dataURLtoBlob(screenshot);
        const animalPhoto = new File([animalPhotoBlob], "animalPhoto.jpg", { type: "image/jpeg" });

        setResultImageUrl(screenshot);
        setResultImageFile(animalPhoto);
    }

    async function handleRegister() {
        setLoading(true); // Set loading to true before sending request
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("animalType", getAnimalTypeByIndex(props.gender, props.resultIndex));
        formData.append("gender", props.gender);

        if (props.gender === "MALE") {
            formData.append("dogScore", props.bar1Percentage);
            formData.append("catScore", props.bar2Percentage);
            formData.append("bearScore", props.bar3Percentage);
            formData.append("dinosaurScore", props.bar4Percentage);
            formData.append("wolfScore", props.bar5Percentage);
            formData.append("rabbitScore", props.bar6Percentage);
            formData.append("animalPhoto", resultImageFile);
        } else {
            formData.append("dogScore", props.bar1Percentage);
            formData.append("catScore", props.bar2Percentage);
            formData.append("desertFoxScore", props.bar3Percentage);
            formData.append("rabbitScore", props.bar4Percentage);
            formData.append("deerScore", props.bar5Percentage);
            formData.append("hamsterScore", props.bar6Percentage);
            formData.append("animalPhoto", resultImageFile);
        }
        try {
            const res = await sendResultImage(props.gender, formData);
            if (res.status === 200) {
                alert("등록이 완료되었습니다!");
            } else {
                alert("등록에 실패했습니다. 관리자에게 문의하세요");
            }
        } catch {
            alert("등록에 실패했습니다. 관리자에게 문의하세요");
        } finally {
            setLoading(false); // Set loading to false after request is complete
        }
    }

    return (
        <Modal>
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        zIndex: 999,
                    }}
                >
                    <RingLoader color="#36D7B7" size={100} />
                </div>
            )}
            <ModalTrigger>
                <GradientButton
                    onClick={() => {
                        props.setShowRotatingImage(false);
                    }}
                    content="등록"
                    buttonStyle={{
                        fontSize: "1rem",
                        fontWeight: "800",
                    }}
                />
            </ModalTrigger>
            <ModalContent>
                <ModalHeader
                    description="결과사진을 등록하고 다운받아보세요!"
                    title="결과사진 등록하기"
                    titleSize={ModalTitleSize.L}
                />
                <ModalBody
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        width: 400,
                    }}
                >
                    <FormControl labelPosition="top">
                        <FormLabel help="다운로드 받을 때 필요한 정보입니다">학번</FormLabel>
                        <TextField
                            placeholder="학번을 입력해주세요"
                            value={studentId}
                            onChange={(e) => {
                                setStudentId(e.target.value);
                            }}
                        />
                    </FormControl>
                    <FormControl labelPosition="top">
                        <FormLabel help="결과이미지.">이미지</FormLabel>

                        <HStack justify="center" style={{ marginBottom: 10 }}>
                            {resultImageUrl && <ImageView url={resultImageUrl} height={400} />}
                        </HStack>
                    </FormControl>
                </ModalBody>
                <ModalFooter
                    rightContent={
                        <ButtonGroup>
                            <ModalClose>
                                <Button
                                    colorVariant={ButtonColorVariant.MonochromeLight}
                                    styleVariant={ButtonStyleVariant.Secondary}
                                    text="취소"
                                    onClick={() => {
                                        setStudentId("");
                                        setResultImageUrl("");
                                        props.setShowRotatingImage(true);
                                    }}
                                />
                            </ModalClose>
                            <ModalClose>
                                <ConfirmButton
                                    trigger={
                                        <Button
                                            colorVariant={ButtonColorVariant.Blue}
                                            styleVariant={ButtonStyleVariant.Primary}
                                            text="등록"
                                        />
                                    }
                                    confirmTitle={`[학번 : ${studentId}] 등록하기`}
                                    confirmDescription={`정말로 등록하시겠습니까??`}
                                    confirmButtonColor={ButtonColorVariant.Blue}
                                    onClick={() => {
                                        if (studentId.length !== 8) {
                                            alert("8자리 학번을 입력해주세요");
                                            setStudentId("");
                                        } else {
                                            handleRegister();
                                            setStudentId("");
                                            setResultImageUrl("");
                                        }
                                        props.setShowRotatingImage(true);
                                    }}
                                />
                            </ModalClose>
                        </ButtonGroup>
                    }
                />
            </ModalContent>
        </Modal>
    );
};

export default RegistrationForm;
