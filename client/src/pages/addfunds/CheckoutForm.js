import React, { useState, useEffect } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { PrimaryButton, Stack, Text, TextField } from "office-ui-fabric-react";
import { globalEmitter } from "../../helpers/emitter";
import { fundAccount, getPaymentIntent } from "../../helpers/network";
import { useHistory } from 'react-router-dom';

export const CheckoutForm = ({ deposit, callback }) => {
  console.log(deposit)
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const options = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#fce883",
        },
        "::placeholder": {
          color: "#87bbfd",
        },
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee",
      },
    },
  };
  const [amountValidated, setAmountValidated] = useState(0);
  const [validated, setValidated] = useState(false);
  const [amount, setAmount] = useState("");

  const onChangeAmount = (event, newValue) => {
    if (newValue) {
      setAmount(newValue);
    } else {
      setAmount("");
    }
  };

  const onSubmitClick = () => {
    if (isNaN(parseFloat(amount))) {
      globalEmitter.emit("notification", {
        type: "error",
        message: "Please enter a valid value",
      });
      return;
    }
    const value = parseFloat(amount) * 100;
    if (value < 0) {
      globalEmitter.emit("notification", {
        type: "error",
        message: "Please enter a positive value",
      });
      return;
    }
    setAmountValidated(value);
    setValidated(true);
  };

  const onClickPay = async () => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod)
    const client_secret = await getPaymentIntent(
      amountValidated,
      paymentMethod
    );
    const {
      paymentIntent,
      error: confirmError,
    } = await stripe.confirmCardPayment(
      client_secret.clientSecret,
      { payment_method: paymentMethod.id },
      { handleActions: false }
    );

    if (confirmError) {
      console.log("error");
    } else {
      // Let Stripe.js handle the rest of the payment flow.
      const { error } = await stripe.confirmCardPayment(
        client_secret.clientSecret
      );
      if (error) {
        globalEmitter.emit("notification", {
          type: "error",
          message: "Payment was not successful",
        });
      } else {
        fundAccount(amountValidated, localStorage.getItem("address")).then(value => {
          globalEmitter.emit("notification", {
            type: "success",
            message: "Payment was completed",
          });
          history.push('/dashboard/sendMoney')
        })
      }
    }
  };

  const onClickWithdraw = async () => {
    callback(amountValidated).then(() => {
      globalEmitter.emit("notification", {
        type: "success",
        message: "Money will be deposited into your account in 1-2 business days",
      });
      history.push('/dashboard/sendMoney')
    })
  }

  return (
    <>
      <Stack
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          },
        }}
      >
        {validated ? (
          <>
            <form
              onSubmit={onClickPay}
              style={{ height: "100%", width: "50%" }}
            >
              <Stack
                styles={{
                  root: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    fontFamily: "'Comfortaa', cursive",
                  },
                }}
              >
                <CardElement
                  options={options}
                  onReady={() => {
                    console.log("CardElement [ready]");
                  }}
                  onChange={(event) => {
                    console.log("CardElement [change]", event);
                  }}
                  onBlur={() => {
                    console.log("CardElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardElement [focus]");
                  }}
                  style={{ border: "2px solid red" }}
                />
                <br />
                <PrimaryButton
                  onClick={deposit ? onClickPay : onClickWithdraw}
                  disabled={!(stripe || elements)}
                >
                  Submit
                </PrimaryButton>
              </Stack>
            </form>
          </>
        ) : (
          <>
            <Text variant="xxLarge" styles={{root:{fontFamily: "'Comfortaa', cursive"}}}>{deposit ? "Deposit" : "Withdraw"} Funds</Text>

            <Stack horizontal>
              <TextField
                placeholder={`Amount to ${deposit ? "deposit" : "withdraw"}`}
                value={amount}
                onChange={onChangeAmount}
                styles={{
                  fieldGroup: {
                    fontFamily: "'Comfortaa', cursive",
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                }}
              />
              <PrimaryButton
                onClick={onSubmitClick}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                Submit
              </PrimaryButton>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
};
