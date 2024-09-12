import React from "react";
import "./NoticeBoard.css";

const NoticeBoard = ( ) => {
    return (
        <div className="noticeboard-container"> 
            <div className="noticeboard-header">
                도움말 
            </div>
            <div className="noticeboard-main">
                <div className="noticeboard-content">
                    성별을 고르고 시작 버튼을 누른 뒤, <br/>
                    5초간 카메라를 응시해주세요.<br/> 
                    
                </div>
                <div className="noticeboard-animal">
                    이런 동물상이 있어요!
                </div>
                <div className="noticeboard-woman">
                        여자 
                        <div className="woman-animal-wrapper"> 
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/dog-woman.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/cat-woman.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/fox.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/rabbit-woman.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/deer.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/hamster.png`}/>
                        </div>    
                </div>
                <div className="noticeboard-man">
                        남자
                        <div className="man-animal-wrapper"> 
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/dog.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/cat-man.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/wolf.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/rabbit-man.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/dinosaur.png`}/>
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/bear.png`}/>
                        </div>    
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
