import React, { useState, useEffect } from 'react';
import { PaymentRequestButtonElement, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import { globalEmitter } from '../../helpers/emitter';
import { getPaymentIntent } from '../../helpers/network';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amountValidated, setAmountValidated] = useState(0);
  const [validated, setValidated] = useState(false);
  const [amount, setAmount] = useState("");

  const onChangeAmount = (event, newValue) => {
    if (newValue) {
      setAmount(newValue);
    } else {
      setAmount("")
    }
  }

  const onSubmitClick = () => {
    if (isNaN(parseFloat(amount))) {
      globalEmitter.emit("notification", { type: "error", message: "Please enter a valid value" })
      return
    }
    const value = parseFloat(amount) * 100;
    if (value < 0) {
      globalEmitter.emit("notification", { type: "error", message: "Please enter a positive value" })
      return
    }
    setAmountValidated(value)
    setValidated(true)
  }

  const onClickPay = () => {
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    const paymentIntent = await getPaymentIntent(amountValidated, paymentMethod);
    //Capture here
  }

  return (
    <>
      {validated ?
        <>
          <CardElement />
          <PrimaryButton onClick={onClickPay} disabled={!(stripe || elements)}>Submit</PrimaryButton>
        </> :
        <>
          <TextField label="Amount to deposit" value={amount} onChange={onChangeAmount} />
          <PrimaryButton onClick={onSubmitClick}>Submit</PrimaryButton>
        </>
      }
    </>
  )
}