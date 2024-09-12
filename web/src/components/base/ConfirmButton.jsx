import React from "react";
import {
    Button,
    ButtonColorVariant,
    ButtonStyleVariant,
    ConfirmModal,
    ConfirmModalTrigger,
    ConfirmModalContent,
    ConfirmModalHeader,
    ConfirmModalFooter,
    ButtonGroup,
    ConfirmModalClose,
} from "@channel.io/bezier-react";

const ConfirmButton = (props) => {
    return (
        <ConfirmModal>
            <ConfirmModalTrigger>{props.trigger}</ConfirmModalTrigger>
            <ConfirmModalContent>
                <ConfirmModalHeader description={props.confirmDescription} title={props.confirmTitle} />
                <ConfirmModalFooter
                    rightContent={
                        <ButtonGroup>
                            <ConfirmModalClose>
                                <Button
                                    colorVariant={ButtonColorVariant.MonochromeLight}
                                    styleVariant={ButtonStyleVariant.Primary}
                                    text="취소"
                                />
                            </ConfirmModalClose>
                            <ConfirmModalClose>
                                <Button
                                    colorVariant={
                                        props.confirmButtonColor ? props.confirmButtonColor : ButtonColorVariant.Red
                                    }
                                    styleVariant={ButtonStyleVariant.Primary}
                                    text="확인"
                                    onClick={props.onClick}
                                />
                            </ConfirmModalClose>
                        </ButtonGroup>
                    }
                />
            </ConfirmModalContent>
        </ConfirmModal>
    );
};

export default ConfirmButton;
