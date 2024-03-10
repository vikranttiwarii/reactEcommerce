import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import { addtocart } from '../Action/index';

const Cart = () => {
  // it is use to show data
  const [data, setData] = useState([]);

  // it is use to show hide of datail model
  const [show, setShow] = useState(false);

  // it is use to show particular data on details
  const [singledata, setSingledata] = useState({});

  // redux start
  // useDispatch are calling in this way
  const dispatch = useDispatch()

  useEffect(() => {
    getCartData()
  }, [data])

  const getCartData = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/userCartData`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      setData(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const removeCartData = (productid) => {
    let obj = {
      productid: productid
    }

    axios.post(`${process.env.REACT_APP_BASE_URL}/deleteCartData`, obj, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      if (res.data.error === false) {
        cartcount()
        toast.success('item remove to cart', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  function cartcount() {
    axios.get(`${process.env.REACT_APP_BASE_URL}/userCartData`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      // console.log(res.data.totalCartItem, 'aDS')
      if (res.data.totalCartItem) {
        console.log(res.data.totalCartItem)
        dispatch(addtocart(res.data.totalCartItem))
        // setCartCount(res.data.totalCartItem)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <>
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
                      <button className="btn btn-danger mt-3" onClick={() => removeCartData(element._id)}>Remove</button>
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
      </div>

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
    </>
  )
}

export default Cart