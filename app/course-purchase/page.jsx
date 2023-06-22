"use client"
import React from 'react'

export default function CheckOut() {

    const [razorypayCode, setRazorypayCode] = React.useState({
        key: '',
        amount: 0,
        id: ''
    })

    const fetchRezorPayDetails = () => {
        const options = {
            method: 'POST',
            body: `{"course_id":"<course_id>"}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + localStorage.getItem('accessToken')
            }
        };

        fetch(`http://localhost:8000/payment/get-details/`, options)
            .then(response => response.json())
            .then(response => setRazorypayCode(response))
            .catch(err => console.error(err));
    }

    const PurchaseConfirm = (response) => {
        const options = {
            method: 'POST',
            body: `{"razorpay_payment_id":"${response.razorpay_payment_id}","razorpay_order_id":"${response.razorpay_order_id}","razorpay_signature":"${response.razorpay_signature}"}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + localStorage.getItem('accessToken')
            }
        };

        fetch(`http://localhost:8000/transaction/course-purchase/`, options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    const MakePayment = (e) => {

        const RazorPayOnSuccess = (response) => {
            PurchaseConfirm(response)
        }

        const RazorPayOnFail = (response) => {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        }
        const options = {
            key: razorypayCode.key, // Enter the Key ID generated from the Dashboard
            amount: razorypayCode.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            order_id: razorypayCode.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            currency: "INR",
            name: "Company Name",
            description: "Purchase Course",
            image: "/logo.png",
            handler: function (response) {RazorPayOnSuccess(response)},
            theme: {
                "color": "#3399cc"
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
        };

        e.preventDefault();
        const payment = new Razorpay(options);
        payment.open();
        payment.on('payment.failed', function (response) {RazorPayOnFail(response)});
    }

    React.useEffect(() => {
        fetchRezorPayDetails()
    }, [])

    return (
        <button onClick={(e) => MakePayment(e)} className='flex justify-center items-center'>
            Pay with Razorpay
            </button>
    )
}
