const options = await new Promise((resolve, reject) => {
  db.query('SELECT DISTINCT i.itemName FROM Item i JOIN Stock s ON i.itemId = s.itemId', (error, results) => {
      if (error) {
          reject(error);
      } else {
          resolve(results);
      }
  });
});



export const savePicOrders = async (req, res) => {
    const { temporderId, name, contact, quantity, formattedDate, cakeText, pickupDate, imgLink, branchId } = req.body;
    const orderId = await generateNewOrderId();
    const status = 'Pending';
    const date = new Date(pickupDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedPickupDate = `${year}-${month}-${day}`;
    console.log(orderId);
    console.log(req.body);

    if (!orderId || !name || !contact || !quantity || !formattedDate || !cakeText || !pickupDate || !imgLink || !branchId) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
        db.beginTransaction(async function (err) {
            if (err) {
                throw err;
            }

            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO picUploadingOrders (picOrderId, name, contact, quantity, orderDate, cakeText, pickupDate, imgLink, branchId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [orderId, name, contact, quantity, formattedDate, cakeText, formattedPickupDate, imgLink, branchId, status], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                // If insertion into picUploadingOrders is successful, delete the record from tempOrders
                db.query('DELETE FROM tempOrders WHERE temporderId = ?', [temporderId], function (error, result) {
                    if (error) {
                        return db.rollback(function () {
                            console.error('Error deleting from tempOrders:', error);
                            return res.status(500).json({ error: 'Failed to delete from tempOrders' });
                        });
                    }
                    db.commit(function (err) {
                        if (err) {
                            return db.rollback(function () {
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ error: 'Transaction failed' });
                            });
                        }
                        console.log('Transaction Complete.');
                        return res.status(200).json({ message: 'Stock details updated successfully' });
                    });
                });
            } else {
                return res.status(500).json({ error: 'Failed to update stock details' });
            }
        });
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
















const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/server/customizeCake/payments', {
            lineItems: [
                { price_data: { currency: 'usd', product_data: { name: 'Customized Cake' }, unit_amount: parseFloat(price) * 100 }, quantity: Quantity }
            ]
        });

        const { id: sessionId, url: checkoutUrl } = response.data;
        window.open(checkoutUrl, '_blank');

        const checkPaymentStatus = setInterval(async () => {
            try {
                const updatedSession = await axios.get(`http://localhost:3001/server/customizeCake/paymentStatus/${sessionId}`);
                if (updatedSession.data.payment_status === 'paid') {
                    clearInterval(checkPaymentStatus);
                    saveOrderDetails();
                } else if (updatedSession.data.payment_status === 'canceled') {
                    clearInterval(checkPaymentStatus);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 3000);
    } catch (error) {
        console.error('Error processing payment:', error);
    }
};

const saveOrderDetails = async () => {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const response = await axios.post('http://localhost:3001/server/customizeCake/placeCustomizeOrder', {
            Name,
            Contact,
            Quantity,
            formattedDate,
            additionalText,
            PickupDate,
            cakeId,
            branchID,
            selectedOption2
        });
        if (response.status === 200) {
            setOrderId(response.data.orderId);
            generatePDF(response.data.orderId);
            Swal.fire({
                icon: 'success',
                title: 'Order Placed Successfully',
                text: `Your order ID is ${response.data.orderId}.`,
            });
            resetForm();
        } else {
            console.error('Failed to place order:', response.data.message);
        }
    } catch (error) {
        console.error('Error saving order details:', error);
    }
};












export const createPaymentIntent = async (req, res) => {
    const { lineItems } = req.body;

  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/SuccessPage',
      cancel_url: 'http://localhost:5173/CancelPage',
    });

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const loadSessionId= async (req, res) => {
    // console.log(req.params.sessionId)
    try {
        const session = await stripeInstance.checkout.sessions.retrieve(req.params.sessionId);
        console.log(session);
        res.json({ payment_status: session.payment_status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};