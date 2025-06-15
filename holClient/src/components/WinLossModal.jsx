import React from "react";

const WinLossModal = (props) => {
    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h1>{props.wol}</h1>
                    <button
                        className="btn btn-light"
                        onClick={props.replayClick}
                    >
                        play again?
                    </button>
                </div>
            </div>
        </>
    );
};

export default WinLossModal;
