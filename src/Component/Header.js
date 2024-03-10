import { React, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';
import '../style/Header.css'
import axios from 'axios';
import validator from 'validator'
import HashLoader from 'react-spinners/HashLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

// redux it used to get value into store
import { useSelector } from 'react-redux';

import { useFormik } from 'formik';
import * as Yup from "yup";

const Header = () => {
    // for login code start here
    const [input, setInput] = useState({ email: "" })
    const [emailError, setEmailError] = useState('')
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');

    const [cartCount, setCartCount] = useState(0)
    let cartData = useSelector((state) => state.cartItem)

    // this is only for practice
    // let transferData = useSelector((state) => state.sendData)
    // console.log(transferData,'transferData')

    useEffect(() => {
        getProfileData();
        cartcount();
        setCartCount(cartData);
    }, [cartData])

    function cartcount() {
        axios.get(`${process.env.REACT_APP_BASE_URL}/userCartData`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            // console.log(res.data.totalCartItem, 'aDS')
            if (res.data.totalCartItem) {
                setCartCount(res.data.totalCartItem)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleChanges = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })

        if (validator.isEmail(e.target.value)) {
            setEmailError('')
        } else {
            setEmailError('Enter valid Email!')
        }
    }

    const login = () => {
        if (input.email == "") {
            setEmailError('This field is required!')
        } else {
            if (emailError !== 'Enter valid Email!') {
                setShowLogin(false)
                setInput({ email: "" })
                axios.post(`${process.env.REACT_APP_BASE_URL}/loginuser`, input).then((res) => {
                    if (res.data.msg === 'you are not a registered user') {
                        toast.warning(res.data.msg, {
                            position: toast.POSITION.TOP_RIGHT,
                        })
                    } else {
                        toast.success("Login Successfully", {
                            position: toast.POSITION.TOP_RIGHT,
                        })
                        localStorage.setItem('token', res.data.token)
                        getProfileData();
                        cartcount()
                    }
                }).catch(() => toast.error("Something Went Wrong", {
                    position: toast.POSITION.TOP_RIGHT,
                }))
            }
        }
    }

    // userName
    const getProfileData = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/add/getprofile`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            }
        ).then((res) => {
            // console.log(res.data.data.userName)
            setUserName(res.data.data.userName)
        }).catch(() => toast.error("Something Went Wrong", {
            position: toast.POSITION.TOP_RIGHT,
        }))
    }

    const resetForm = () => {
        setEmailError('')
        setInput({ email: "" })
    }

    const handleResponsive = () => {
        document.querySelector('.handle').classList.toggle('responsive')
    }
    // for login code end here

    // for register code start here
    const [showRegister, setShowRegister] = useState(false);

    const signUpSchema = Yup.object({
        userName: Yup.string().min(2).max(25).required("Please enter your name"),
        email: Yup.string().email().required("Please enter your email"),
        contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Please enter your Contact number '),
        // password: Yup.string().min(6).required("Please enter your password"),
        // confirm_password: Yup.string()
        //   .required()
        //   .oneOf([Yup.ref("password"), null], "Password must match"),
    });

    const initialValues = {
        userName: '',
        email: '',
        contactNumber: ''
    }

    const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initialValues,
        validationSchema: signUpSchema,
        validateOnChange: true,
        validateOnBlur: false,
        onSubmit: (values, action) => {
            setShowRegister(false)
            action.resetForm();
            axios.post(`${process.env.REACT_APP_BASE_URL}/add/profile`, values).then((res) => {
                if (res.data.msg == 'This email is already exist') {
                    toast.warning(res.data.msg, {
                        position: toast.POSITION.TOP_RIGHT,
                    })
                } else {
                    toast.success("Register Successfully", {
                        position: toast.POSITION.TOP_RIGHT,
                    })
                }
            }).catch(err => toast.success("Something Went Wrong", {
                position: toast.POSITION.TOP_RIGHT,
            }))
        },
    });
    // console.log(errors)

    // for register code end here

    return (
        <>
            <div className="navbar-outer-container  handle">
                <div className="navbar-inner-container">
                    <div className="burger-logo">
                        <div style={{ paddingTop: "10px", cursor: 'pointer' }}>
                            <Link to="">
                                <span>Indian</span>
                                <span>Market</span>
                            </Link>
                        </div>
                        <div className="handle-icon" onClick={handleResponsive}>
                            <i className="fa-solid fa-2x fa-bars"></i>
                        </div>
                    </div>
                    <div className="left-container">
                        <div className="search">
                            <input type="text" name="" id="" placeholder="Search here..." />
                            <div><i className="fa-solid mySearch fa-magnifying-glass search-icon"></i></div>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className="cart">
                            <i className="bi bi-cart4"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                                height="30" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                <path
                                    d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                            </svg></i>
                            <p className="cart-count" >{cartCount}</p>
                            <Link to="/cart" className="ps-2" style={{ cursor: 'pointer' }}>Cart</Link>
                        </div >
                        <div className="myorder">
                            <span>
                                <i className="fas fa-border-all fa-xl"></i>
                            </span>
                            <Link to="/order" className="ps-2">My Order</Link>
                        </div >
                        <div className="profile">
                            <Link to="/profile">
                                <span><i className="fa-regular fa-xl fa-user"></i></span>
                                <span className="ps-2" style={{ color: 'black', fontSize: 'large' }}>{userName}</span >
                            </Link>
                        </div >
                        <div className="profile">
                            <span className="ps-2" style={{ fontWeight: "bold" }} onClick={() => setShowLogin(true)}>LogIn</span>
                            {/* <span class="ps-2" style="font-weight: bold;" onClick={Logout}>LogOut</span> */}
                        </div >
                    </div >
                </div >
            </div >

            <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton onClick={resetForm}>
                    <Modal.Title>Login Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="mb-3">
                        <label for="formGroupExampleInput2" className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
                        <input type="email" className="form-control" id="formGroupExampleInput2" name="email" onChange={handleChanges} required />
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{emailError}</span>
                    </div>

                    <div className="text-center">
                        <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#register" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setShowRegister(true); setShowLogin(false) }}>If you not registerd then click here...</span>
                        <button type="button" className="btn btn-success ms-5" onClick={login}>Login</button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={showRegister} onHide={() => setShowRegister(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label for="name" className="form-label">User Name <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" className="form-control" id="name" name='userName' autoComplete='off' value={values.userName} onChange={handleChange} onBlur={handleBlur} />
                            {touched.userName && errors.userName ? <span style={{ fontWeight: 'bold', color: 'red' }}>{errors.userName}</span> : null}
                        </div>
                        <div className="mb-3">
                            <label for="email" className="form-label">Email address <span style={{ color: 'red' }}>*</span></label>
                            <input type="email" className="form-control" id="email" name='email' autoComplete='off' value={values.email} onChange={handleChange} onBlur={handleBlur} />
                            {touched.email && errors.email ? <span style={{ fontWeight: 'bold', color: 'red' }}>{errors.email}</span> : null}
                        </div>
                        <div className="mb-3">
                            <label for="number" className="form-label">Contact Number <span style={{ color: 'red' }}>*</span></label>
                            <input type="number" className="form-control" id="number" name='contactNumber' autoComplete='off' value={values.contactNumber} onChange={handleChange} onBlur={handleBlur} />
                            {touched.contactNumber && errors.contactNumber ? <span style={{ fontWeight: 'bold', color: 'red' }}>{errors.contactNumber}</span> : null}

                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-success">Register</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>


            {/* react-spinner */}
            {/* <HashLoader color={'#36d7b7'} loading={loading} size={80} /> */}

            {/* react-toastify */}
            <ToastContainer />
        </>
    )
}

export default Header;