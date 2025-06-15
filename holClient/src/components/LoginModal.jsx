import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginModal = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const isEsc = (e) => {
        if (e.key === "Escape") {
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
                "http://localhost:5000/api/login",
                user
            );
            const token = res.data.token;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //sets all axios requests to send token to verify the user
            setTimeout(() => {
                props.onClose();
            }, 100);
        } catch (err) {
            console.error(err.message);
        }
    };
    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <form className="loginForm" onSubmit={handleSubmit}>
                        <h1>Log In</h1>
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

                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                        ></input>

                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        ></input>

                        <button
                            className="btn btn-success"
                            type="submit"
                            style={{ marginTop: "10px" }}
                        >
                            submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginModal;
