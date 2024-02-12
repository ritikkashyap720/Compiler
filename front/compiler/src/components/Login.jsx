import React, { useEffect, useState } from 'react'
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
      async function checkAuth(){
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const response = await fetch('http://localhost:8000/auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if(response){
                    const result = await response.json()
                   
                    if(result.msg=="authorized"){
                        navigate("/")
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
      }
      checkAuth()
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);
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
                navigate("/")
            } else {
                setErr(result.err)
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
