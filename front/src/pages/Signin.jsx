import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Signin() {



    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
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
        const response = await fetch('http://localhost:8000/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
        });
        if (response) {
            const result = await response.json()
            if (result.msg == "success") {
                navigate("/login")
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
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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

export default Signin
