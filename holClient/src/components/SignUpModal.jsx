import React, { useState, useEffect } from "react";
import axios from "axios";

const SignUpModal = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const isEsc = (e) => {
        if (e.key == "Escape") {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (isEsc(e)) {
                props.onClose();
            }
        });
        return document.removeEventListener("keydown", (e) => {
            if (isEsc(e)) {
                props.onClose();
            }
        });
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5000/api/register",
                user
            );
            if (res.data === "User already exists") {
                return alert("User already exists");
            }
            props.onClose();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    onClick={props.onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2>Sign Up!</h2>

                <form className="signInForm" onSubmit={handleSubmit}>
                    <label>username</label>

                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                    />
                    <label style={{ marginTop: "10px" }}>password</label>

                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                    />

                    <button
                        className="btn btn-success"
                        style={{ marginTop: "10px" }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpModal;
