import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const View = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [singledata, setSingledata] = useState({});
    // const [filterdata, setFilterdata] = useState({});

    useEffect(() => {
        axios.get(' http://localhost:5000/getall/product').then((res) => {
            setData(res.data.data)

        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function addToCart(productId) {
        let obj = {}
        obj['productId'] = productId
        axios.post('http://localhost:5000/add/cart', obj, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log(res.data)
            cartcount()
            if (res.data.message === 'Invalid Token') {
                toast.warning('You are not logged in', {
                    position: toast.POSITION.TOP_RIGHT,
                })
            } else if (res.data.msg === 'This item is already added to cart') {
                toast.warning(res.data.msg, {
                    position: toast.POSITION.TOP_RIGHT,
                })
            } else {
                toast.success('item added to cart', {
                    position: toast.POSITION.TOP_RIGHT,
                })
            }
        }).catch(() => toast.error("Something Went Wrong", {
            position: toast.POSITION.TOP_RIGHT,
        }))
    }

    // totalcartItem
    function cartcount() {
        axios.get('http://localhost:5000/userCartData',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log(res.data.totalCartItem)
        }).catch((err) => {
            console.log(err)
        })
    }

    // function getdetail() {
    //     for (let key in singledata) {
    //         if (singledata[key] == '' || key == '_id' || key == 'imgUrl' || key == 'productImage') {
    //             continue;
    //         } else {
    //             filterdata[key] = singledata[key]
    //             setFilterdata({ ...filterdata });
    //         }
    //     }
    // }

    return (
        <div className='ps-5 pe-5 d-flex justify-content-between flex-wrap'>
            {
                data.map((element) => {
                    return (
                        <Card style={{ width: '20rem', marginTop: '20px' }}>
                            <Card.Img variant="top" src={element.imgUrl} style={{ maxHeight: '200px' }} />
                            <Card.Body>
                                <Card.Text >
                                    <p className='text-center'><b>{element.productName}</b>&nbsp;({element.productStorage})</p>
                                    <p className='text-center' style={{ lineHeight: '0%' }}><b>&#8377; </b> {element.productPrice}</p>
                                    <div className='text-center'>
                                        <button className="btn btn-success mt-3 me-3">BuyNow</button>
                                        <button className="btn btn-primary mt-3" onClick={() => addToCart(element._id)}>Add to Cart</button>
                                    </div>
                                    <div className='text-center'>
                                        <button className="btn btn-outline-dark mt-3" data-bs-toggle="modal" data-bs-target="#detail" style={{ textDecoration: 'none' }} onClick={() => { setSingledata(element); setShow(true) }}>Detail</button>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )
                })
            }

            <Modal size="xl" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Other Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-wrap justify-content-between">
                    {
                        Object.keys(singledata).map((key, index) => {
                            return (
                                <p ><b>{key} : </b>{singledata[key]}</p>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default View