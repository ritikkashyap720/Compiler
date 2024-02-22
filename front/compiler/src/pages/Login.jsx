import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [err, setErr] = useState("")

    // check if user is logged in 

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token")
            const id = localStorage.getItem("id");
            const username = localStorage.getItem("name")

            if (token!=null && username!=null && id!=null) {
                try {
                    const response = await fetch('http://localhost:8000/auth', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response) {
                        const result = await response.json()

                        if (result.msg == "authorized") {
                            navigate("/")
                        }
                    }
                } catch (error) {
                   toast.error(error)
                }
            }
        }
        checkAuth()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: formData.email,
                password: formData.password
            })
        });
        if (response) {
            const result = await response.json()
            console.log(result)
            if (result.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("name", result.name);
                localStorage.setItem("id", result.id);
                navigate("/")
                toast.success("Login succesfull", {
                    duration: 1000,
                    position: 'top-center',
                })
            } else {
                toast.error(result.err, {
                    duration: 1000,
                    position: 'top-center',
                })
            }
        }


        setFormData({
            name: '',
            email: '',
            password: ''
        });
    };


    return (
        <div>
            <h2>Login In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {err && <p>{err}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}
