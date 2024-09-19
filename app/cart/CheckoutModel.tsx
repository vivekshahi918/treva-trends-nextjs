'use client';

import { Button, message, Modal } from 'antd';
import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import Loader from '../components/Loader';

const stripePromise = loadStripe('pk_test_51PtRXWHGfWb0iHWoDEkw2VcmrqXSEpOz7aUCYR7Eng2FapFq66x8F5n3L6VobfrTug4Stmiwk5KEJBi335bamiVG00Nb3JXhm0');

interface CheckoutModelProps {
  showCheckoutModal: boolean;
  setShowCheckoutModal: any;
  total: number;
}

function CheckoutModel({
  showCheckoutModal,
  setShowCheckoutModal,
  total,
}: CheckoutModelProps) {
  const [loading, setLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState('');

  const loadClientSecret = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/stripe_client_secret", { amount: total });
      setClientSecret(res.data.clientSecret);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [total]); // Add `total` as a dependency since it's used in the function

  useEffect(() => {
    loadClientSecret();
  }, [loadClientSecret]); // Add `loadClientSecret` as a dependency

  return (
    <Modal
      title={
        <div className='flex justify-between items-center font-bold text-xl'>
          <span>Checkout</span>
          <span>Total: ${total}</span>
        </div>
      }
      open={showCheckoutModal}
      onCancel={() => setShowCheckoutModal(false)}
      centered
      closable={false}
      footer={false}
    >
      {loading && <Loader />}
      <hr />
      <div className="mt-5">
        {stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret,
            }}
          >
            <CheckoutForm
              total={total}
              setShowCheckoutModal={setShowCheckoutModal}
            />
          </Elements>
        )}
      </div>
    </Modal>
  );
}

export default CheckoutModel;
