import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import auth from "./config";

function App() {
    const [sub, setsub] = useState("")
    const [txt, settxt] = useState("");
    const [sending, setsending] = useState(true);
    const [emaillist, setemaillist] = useState([]);
    const [file, setFile] = useState(null);
    const navigate=useNavigate();

    useEffect(()=>{
            auth.onAuthStateChanged(function(user){
                if(user){
                    // console.log("logged in");
                    navigate("/bulkmail");
                }
                else{
                    // console.log("logged out");
                    alert("Login before Using it")
                    navigate("/");
                }
            })
        },[navigate])

    function handlesubject(evt) {
        // console.log(evt);
        setsub(evt.target.value);
    }

    function handletxt(evt) {
        settxt(evt.target.value);
    }

    function handlefile(event) {
        const file = event.target.files[0]

        if (file) {
            setFile(file);
        }
        
        // console.log(file)
        const reader = new FileReader();
        reader.onload = function (evt) {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
            // console.log(emailList);
            setemaillist(emailList);
        }
        reader.readAsBinaryString(file);
    }
    function logout(){
        signOut(auth).then(()=>{
            navigate("/");
        })
    }

    function sendemail() {
        // console.log("sent")
        setsending(false);
        axios.post("https://bulkmail-sender-3.onrender.com/send", { subject: sub, message: txt, emaillist: emaillist }).then(function (data) {
            if (data.data === true) {
                alert("Email was Sent Successfully.:)");
                setsending(true);
                setFile(null);
                setemaillist([]);
            }
        }).catch(function (error) {
            console.log(error);
            alert("Check the App password and login again");
            navigate("/");
        });
        setsub("");
        settxt("");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

            {/* Header */}
            <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">
                            BULK<span className="text-blue-400">MAIL</span>
                        </h1>

                        <p className="text-sm text-gray-400">
                            Simple & powerful bulk email sender
                        </p>
                    </div>

                    <div className="hidden sm:block">
                        <button className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-white text-sm cursor-pointer font-semibold hover:bg-red-500"
                        onClick={logout}
                        >
                            LOG OUT
                        </button>
                    </div>

                </div>
            </header>


            {/* Main */}
            <main className="max-w-5xl mx-auto px-5 py-10">

                {/* Welcome */}
                <div className="text-center mb-10">

                    <h2 className="text-4xl font-bold mb-3">
                        We are here to help you 🚀
                    </h2>

                    <p className="text-gray-400">
                        Upload your email list, write your message and send it instantly.
                    </p>

                </div>


                {/* Main Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">


                    {/* Email Content */}
                    <div className="p-6 md:p-8">

                        {/* Subject */}
                        <div className="mb-7">

                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    📝
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Subject
                                    </h3>

                                    <p className="text-sm text-gray-400">
                                        Enter the subject of your email
                                    </p>
                                </div>

                            </div>


                            <input
                                onChange={(e) => handlesubject(e)}
                                type="text"
                                placeholder="Enter email subject..."
                                value={sub}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />

                        </div>


                        {/* Email Message */}
                        <div>

                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    ✉️
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Email Message
                                    </h3>

                                    <p className="text-sm text-gray-400">
                                        Write the message you want to send
                                    </p>
                                </div>

                            </div>


                            <textarea
                                onChange={(e) => handletxt(e)}
                                placeholder="Enter the email text..."
                                value={txt}
                                className="w-full h-44 bg-slate-900/80 border border-white/10 rounded-xl p-4 outline-none resize-none text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            ></textarea>

                        </div>

                    </div>


                    {/* Upload Section */}
                    <div className="border-t border-white/10 p-6 md:p-8">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                📁
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold">
                                    Upload Email List
                                </h3>

                                <p className="text-sm text-gray-400">
                                    Upload a CSV or text file containing email addresses
                                </p>
                            </div>

                        </div>


                        {/* Drag & Drop */}
                        <label className="group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-500/40 rounded-xl cursor-pointer bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-400 transition">

                            {!file ? (
                                <>
                                    <div className="text-5xl mb-3 group-hover:scale-110 transition">
                                        📤
                                    </div>

                                    <p className="text-lg font-medium">
                                        Drag & Drop your file here
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        or click to browse
                                    </p>

                                    <p className="text-xs text-gray-600 mt-2">
                                        Supported files: CSV, TXT, XLSX
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="text-5xl mb-3">
                                        📄
                                    </div>

                                    <p className="text-lg font-medium text-green-400">
                                        {file.name}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-2">
                                        File selected successfully
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                onChange={handlefile}
                                accept=".csv,.txt,.xlsx"
                                className="hidden"
                            />

                        </label>

                    </div>


                    {/* Email Count + Send */}
                    <div className="border-t border-white/10 bg-slate-950/40 p-6 md:p-8">

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">


                            {/* Email Counter */}
                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                                    👥
                                </div>

                                <div>

                                    <p className="text-gray-400 text-sm">
                                        Total Emails
                                    </p>

                                    <h3 className="text-3xl font-bold">
                                        {emaillist.length}
                                    </h3>

                                </div>

                            </div>


                            {/* Send Button */}
                            <button
                                onClick={sendemail}
                                className="w-full md:w-auto px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition font-semibold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <span>🚀</span>
                                {sending ? <p>Send Emails</p> : <p>Sending</p>}
                            </button>

                        </div>

                    </div>

                </div>


                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">


                    {/* Feature 1 */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

                        <div className="text-2xl mb-3">
                            ⚡
                        </div>

                        <h3 className="font-semibold mb-1">
                            Fast Delivery
                        </h3>

                        <p className="text-sm text-gray-400">
                            Send your emails quickly and efficiently.
                        </p>

                    </div>


                    {/* Feature 2 */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

                        <div className="text-2xl mb-3">
                            🔒
                        </div>

                        <h3 className="font-semibold mb-1">
                            Secure
                        </h3>

                        <p className="text-sm text-gray-400">
                            Your email data stays protected.
                        </p>

                    </div>


                    {/* Feature 3 */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

                        <div className="text-2xl mb-3">
                            📊
                        </div>

                        <h3 className="font-semibold mb-1">
                            Easy Management
                        </h3>

                        <p className="text-sm text-gray-400">
                            Manage your email campaigns easily.
                        </p>

                    </div>

                </div>

            </main>


            {/* Footer */}
            <footer className="border-t border-white/10 mt-10">

                <div className="max-w-6xl mx-auto px-6 pt-6 text-center text-sm text-gray-500">

                    © 2026 BULKMAIL • Simple. Fast. Reliable.


                </div>
                <div className="max-w-6xl mx-auto px-6 pb-6 text-center text-sm text-gray-500">

                    Designed by SANDY


                </div>

            </footer>

        </div>
    );
}

export default App;