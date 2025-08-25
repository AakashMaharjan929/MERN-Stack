import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:4444';

const ManageCheckout = () => {
    const [checkoutData, setCheckoutData] = useState([]);

    useEffect(() => {
        fetchCheckoutData();
    }, []);

    const fetchCheckoutData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/checkoutTotal/checkoutAll`);
            const data = await response.json();
            setCheckoutData(data);
        } catch (error) {
            console.error('Error fetching checkout data:', error);
        }
    };

    //send the respective table data to the backend when complete button is pressed
   const handleComplete = async (data,id,status) => {
    //console.log data
    console.log(data);
    console.log(id);

    const formData = {
        username: data.username,
        title: data.title,
        size: data.size,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        address: data.address,
        dateOfPurchase: data.dateOfPurchase,
        status: status
    };

    console.log(formData);

    axios.put(`${BASE_URL}/checkoutTotal/updateStatus/${id}`, formData)
    .then((response) => {
        console.log(response);
        fetchCheckoutData();
    })
    .catch((error) => {
        console.error(error);
    });

    // axios.delete(`${BASE_URL}/checkoutTotal/deleteCheckout/${id}`)
    
    //     .then((response) => {
    //         console.log(response);
    //         fetchCheckoutData();
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });

   }

   //delete the checkout from database using id when cancel button is pressed also refresh data
    const handleCancel = async (data,id) => {
        console.log(data);
    console.log(id);

    const formData = {
        username: data.username,
        title: data.title,
        size: data.size,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        address: data.address,
        dateOfPurchase: data.dateOfPurchase,
        status: "Cancelled"
    };

    console.log(formData);

    axios.post(`${BASE_URL}/checkoutReport`, formData)
    .then((response) => {
        console.log(response);
        fetchCheckoutData();
    })
    .catch((error) => {
        console.error(error);
    });

        console.log(id);
        axios.delete(`${BASE_URL}/checkoutTotal/deleteCheckout/${id}`)
        .then((response) => {
            console.log(response);
            fetchCheckoutData();
        })
        .catch((error) => {
            console.error(error);
        });
    }
    

  

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <h1>Manage Checkout</h1>
            {[...checkoutData].reverse().map((checkout, index) => {
                const {username, title, size, quantity, totalPrice, address, dateOfPurchase, status } = checkout;
                return(


                <div key={index} style={{ marginBottom: '20px' }}>
                    <h3>Username : {username}</h3>
                    <table className="w3-table w3-bordered w3-striped w3-border w3-hoverable w3-centered">
                        <thead>
                            <tr className="w3-light-grey">
                                <th>Title</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {title.map((title, index) => (
                                <tr key={index}>
                                    <td>{title}</td>
                                    <td>{size[index]}</td>
                                    <td>{quantity[index]}</td>
                                    <td>{status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h5>Address : {address}</h5>
                    <h5>Date : {formatDate(dateOfPurchase)}</h5>
                    <h5>Total : Rs.{totalPrice}</h5>
                    {/* w3 css button */}
                    {/* <button className="w3-button w3-blue w3-margin-right" >Completed</button> */}
                  <button
    className="w3-button w3-green w3-margin-right"
    onClick={() => handleComplete(checkout, checkout._id, "Delivered")}
>
    Delivered
</button>
<button
    className="w3-button w3-blue w3-margin-right"
    onClick={() => handleComplete(checkout, checkout._id, "Shipped")}
>
    Shipped
</button>
<button
    className="w3-button w3-orange w3-margin-right"
    onClick={() => handleComplete(checkout, checkout._id, "Out for Delivery")}
>
    Out for Delivery
</button>

                    <button className="w3-button w3-red" onClick={() => handleComplete(checkout,checkout._id, "Packing")}>Packing</button>
                    <hr />
                </div>
                )

})}
        </div>
    );
};

export default ManageCheckout;
