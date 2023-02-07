var express = require('express');
var router = express.Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

let orderID = '';
router.post(`/klarna`, async function (req, res) {
    const encodedText = new Buffer.from(process.env.USERNAME + ':' + process.env.PASSWORD).toString('base64');
	const url =
		'https://api.playground.klarna.com/checkout/v3/orders/';
	const options = {
		method: 'POST',
        headers: {
            'Authorization': 'Basic ' + encodedText,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "purchase_country": "SV",
            "purchase_currency": "SEK",
            "locale": "sv-SE",
            "order_amount": req.body.amount,
            "order_tax_amount": req.body.amount * 0.2,
            "order_lines": req.body.orders,
            "merchant_urls": {
                "terms": "https://www.example.com/terms.html",
                "checkout": "http://examensarbete.webb1y.se/klarna",
                "confirmation": "http://examensarbete.webb1y.se/klarna",
                "push": "https://www.example.com/api/push"
            }
        })
	};
	// promise syntax
	fetch(url, options)
		.then(res => res.json())
		.then(json => {
            orderID = json.order_id;
        })
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url, options);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

router.get(`/klarna-confirmation`, async function (req, res) {
    const encodedText = new Buffer.from(process.env.USERNAME + ':' + process.env.PASSWORD).toString('base64');
	const url =
		'https://api.playground.klarna.com/checkout/v3/orders/' + orderID;
	const options = {
		method: 'GET',
        headers: {
            'Authorization': 'Basic ' + encodedText,
            'Content-Type': 'application/json'
        }
	};
	// promise syntax
	fetch(url, options)
		.then(res => res.json())
		.then(json => {
        })
		.catch(err => console.error('error:' + err));
	try {
		let response = await fetch(url, options);
		response = await response.json();
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Internal Server Error.`});
	}
});

module.exports = router;
