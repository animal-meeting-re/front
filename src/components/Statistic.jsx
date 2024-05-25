import React from "react";
import "./Statistic.css";

const Statistic = (props) => {
    return (
        <div className="noticeboard-container">
            <div className="noticeboard-header">
                통계
            </div>
            <div className="noticeboard-content"> 
                누적 참여자 {props.count}명! 
                </div> 
                <div className="noticeboard-woman">
                        여자는 {props.most_woman_animal}이 많이 신청했어요
                        <div className="woman-animal-wrapper">  
                        <img src={`${process.env.PUBLIC_URL}/img/woman-animal/${props.most_woman_path}.png`}/> 
                        </div>
                            
                </div>
                <div className="noticeboard-man">
                        남자는 {props.most_man_animal}이 많이 신청했어요
                        <div className="man-animal-wrapper"> 
                        <img src={`${process.env.PUBLIC_URL}/img/man-animal/${props.most_man_path}.png`}/> 
                        </div>    
                </div>
            </div> 
    );
}; 
export default Statistic;
