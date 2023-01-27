import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function User() {
    const navigate=useNavigate(); 
    const [currentUser,serCurrentUser]=useState({});
    const [isEdit,setEdit]=useState(false);
    const [userList,setUserList] = useState([]);
    const formik= useFormik({
      initialValues :{
        name : "",
        age : "",
        email: "",
      },
      validate : (values) =>{
        let error ={};
        if(values.name === ""){
          error.name= "Please Enter name"
        }
        if(values.email === ""){
          error.email= "Please Enter email"
        }
        return error;
      },
      onSubmit : async(values) =>{
        try {
          if(!isEdit)
          {
          await axios.post("http://localhost:5000/user",values,{
            headers :{
                Authorization :`${window.localStorage.getItem("token")}`
            }
        })
          getUsers();
          alert('User Inserted')
          }else
          {
          await axios.put(`http://localhost:5000/user/${currentUser._id}`,values,{
            headers :{
                Authorization :`${window.localStorage.getItem("token")}`
            }
        })
          getUsers();
          setEdit(false)
          }
          formik.resetForm()
        }  catch (error) {
          console.log(error);
          navigate("/")
        }
      }
    });
    useEffect(
      ()=> {
        getUsers();
      },[]);
  
    const getUsers = async () =>{
      try {
        const users= await axios.get("http://localhost:5000/users",{
            headers :{
                Authorization :`${window.localStorage.getItem("token")}`
                
            }
        });
        setUserList(users.data)
      } catch (error) {
        navigate("/")
      }
    };
  
      const handleEdit= async (id) => {
      try {
        const user = await axios.get(`http://localhost:5000/user/${id}`,{
          headers :{
              Authorization :`${window.localStorage.getItem("token")}`
          }
      })
        serCurrentUser(user.data)
        setEdit(true)
        formik.setValues({
          name: user.data.name,
          age : user.data.age,
          email : user.data.email
        });
        setEdit(true);
      
      } catch (error) {
        navigate("/")
      }
    };
    const handleDelete= async (id) =>{
      try {
        await axios.delete(`http://localhost:5000/user/${id}`,{
          headers :{
              Authorization :`${window.localStorage.getItem("token")}`
          }
      })
        getUsers();
      } catch (error) {
        navigate("/")
      }
    };
    return (
    <div className="container">
      <div className='row'>
        <div className='col-lg-6'>
            <form onSubmit={formik.handleSubmit}>
            <div className='row'>
               <div className='col-lg-6'>
                  <label>Name</label>
                  <input 
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  name="name"
                  type={"text"} className="form-control"></input>
               </div>
               <div className='col-lg-6'>
                  <label>Age</label>
                  <input
                  onChange={formik.handleChange}
                  value={formik.values.age}
                  name="age"
                  type={"number"} className="form-control"></input>
               </div>
               <div className='col-lg-12'>
                  <label>Email</label>
                  <input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                  type={"text"} className="form-control"></input>
               </div>
               <div className='col-lg-12'>
                  <input type={"submit"} values={isEdit ? 'Update' : "Submit" } className="btn btn-primary mt-2"></input>
               </div>
            </div>
            </form>
        </div>
        <div className='col-lg-6'>
        <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {
                userList.map((user,index)=>
                {
                  return <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-info btn-sm" onClick= {() => handleEdit(user._id)} >Edit</button>
                      <button  className="btn btn-danger btn-sm" onClick={ () => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default User