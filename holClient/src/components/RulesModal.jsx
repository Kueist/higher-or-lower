import React, { useState, useEffect } from "react";

const RulesModal = (props) => {
    const isEsc = (e) => {
        if (e.key === "Escape") {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", () =>
            isEsc ? props.onClose() : NULL
        );
        return document.removeEventListener("keydown", () =>
            isEsc ? props.onClose() : NULL
        );
    });

    // useEffect(() => {
    //     document.addEventListener("click", () => props.onClose());
    //     return document.removeEventListener("click", () => props.onClose());
    // });
    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h1>Rules</h1>
                    <p>
                        The goal is to guess if the next card in the list is
                        higher or lower than you card (left) Aces are considered
                        higher than a king and a pair is a loss.
                    </p>
                </div>
            </div>
        </>
    );
};

export default RulesModal;
