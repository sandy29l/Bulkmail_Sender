import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from './config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [error, seterror] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // console.log("logged in");

                navigate("/bulkmail");
            }
            else {
                // console.log("logged out");
                navigate("/");
            }
        })
    }, [navigate])

    // function check(e) {
    async function check(e) {
        e.preventDefault();

        if (!gmail.endsWith("@gmail.com") || password.length < 16) {
            seterror(true);
            setGmail("");
            setPassword("");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    gmail: gmail,
                    password: password
                }
            );

            console.log(response.data.message);

            if (response.data.success) {
                try {
                    await signInWithEmailAndPassword(auth, gmail, password);

                    console.log("User logged in");
                    navigate("/bulkmail");

                } catch (firebaseError) {

                    // If Firebase user doesn't exist, create one
                    await createUserWithEmailAndPassword(
                        auth,
                        gmail,
                        password
                    );

                    console.log("New User Created");
                    navigate("/bulkmail");
                }

            } else {
                alert("Gmail authentication failed: Enter Valid App Password");
                setGmail("");
                setPassword("");
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
        }


    // }

    // if (loggedIn) {
    //     axios.post("http://localhost:5000/login",{gmail:gmail,password:password}).then(function(data){
    //         console.log(data.data.message)
    //     }).catch(function(data){
    //         console.log(data.data.message);
    //     })
    //         // navigate("/bulkmail");
    // }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">

            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white w-full max-w-md rounded-2xl shadow-2xl p-8">

                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">📧</div>

                    <h1 className="text-3xl font-bold text-blue-600">
                        Bulk Mail Login
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Login using your Gmail App Password
                    </p>
                </div>

                <form className="space-y-5">

                    {/* Gmail */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Gmail Address
                        </label>

                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={gmail}
                            onChange={(e) => { setGmail(e.target.value); seterror(false) }}
                            className={`w-full border ${!error ? "border-gray-300" : "border-red-600 border-2"} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                        />
                        {error ? <p className="text-red-600 text-sm font-semibold pl-2">Incorrect username</p> : null}
                    </div>

                    {/* App Password */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                            Gmail App Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter 16 character App Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value);; seterror(false) }}
                                className={`w-full border ${!error ? "border-gray-300" : "border-red-600 border-2"} rounded-xl text-black px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-blue-500`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3 text-sm text-blue-600 font-medium"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                            {error ? <p className="text-red-600 text-sm font-semibold pl-2">Incorrect Password</p> : null}

                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                            Enter the 16-character password generated by Google.
                        </p>
                    </div>

                    {/* Help */}

                    <button
                        type="button"
                        onClick={() => setShowGuide(true)}
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        How do I create a Gmail App Password?
                    </button>

                    {/* Login */}

                    <button
                        type="submit"
                        onClick={check}
                        disabled={loading}
                        className={`w-full text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3
        ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>
            </div>

            {/* Modal */}

            {showGuide && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">

                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">

                        <button
                            onClick={() => setShowGuide(false)}
                            className="absolute right-4 top-3 text-gray-500 hover:text-red-500 text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Create Gmail App Password
                        </h2>

                        <p className="text-gray-500 mb-5 text-sm">
                            Follow these steps in your Google Account.
                        </p>

                        <div className="space-y-4">

                            <div className="flex gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>

                                <p className="text-gray-700">
                                    Open your Google Account and go to Security.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>

                                <p className="text-gray-700">
                                    Enable <b>2-Step Verification</b>.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>

                                <p className="text-gray-700">
                                    Search for <b>App Passwords</b>.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    4
                                </div>

                                <p className="text-gray-700">
                                    Enter an app name like <b>Bulk Mail</b>.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    5
                                </div>

                                <p className="text-gray-700">
                                    Click Create and copy the generated
                                    <b> 16-character App Password</b>.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        🎥 Video Tutorial
                                    </h3>

                                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                                        <iframe
                                            className="w-full h-full"
                                            src="https://www.youtube.com/embed/MkLX85XU5rU"
                                            title="How to create Gmail App Password"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <a
                            href="https://myaccount.google.com/apppasswords"
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Open Google App Passwords
                        </a>

                    </div>

                </div>
            )}

        </div>
    );
}