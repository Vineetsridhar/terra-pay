import React from "react";
import { CheckoutForm } from "./CheckoutForm";
import "./AddFunds.css";

export function AddFunds() {
  return <CheckoutForm deposit={true} callback={null}/>;
}
