import axios from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login () {
    const navigate=useNavigate();
    const formik= useFormik({
        initialValues : {
            email : "",
            password : ""
        },
        onSubmit : async (values) => {
            try{
                const login = await axios.post("http://localhost:5000/login",values) 
                window.localStorage.setItem("token",login.data.token)
                console.log(login.data.token);
                navigate("/user")
            }catch(error){
                alert("Login Failed");
                console.log(error);
            }
        }
     })
  return (
    <div className="container">
        <form onSubmit={formik.handleSubmit}>
            <div className="row">
                <div className="col-lg-12">
                    <button 
                        onClick={() =>{
                            window.localStorage.removeItem("token"); 
                            navigate("/")
                        }}
                         className="btn btn-danger btn-sm">
                        Log Out
                    </button>
                </div>
                <div className="col-lg-12">
                    <label>Email</label>
                    <input type={"email"} 
                    className="form-control"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}/>
                </div>
                <div className="col-lg-12">
                    <label>Password</label>
                    <input type={"password"} 
                    name="password"
                    className="form-control"
                    value={formik.values.password}
                    onChange={formik.handleChange}/>
                </div>
                <div className="col-lg-12 mt-2">
                    <input type={"submit"} value="Login" className="btn btn-primary"/>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Login
