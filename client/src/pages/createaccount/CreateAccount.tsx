import React, { useState } from "react";
import { LCDClient, Coin, MnemonicKey } from '@terra-money/terra.js';
import { PrimaryButton, Text } from '@fluentui/react'
import { globalStyles } from "../../assets/styles";
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import "./CreateAccount.css";
import { createNewUser, isUsernameUnique } from "../../helpers/network";
import { globalEmitter } from "../../helpers/emitter";
import { useHistory } from "react-router-dom";

const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev/',
    chainID: 'tequila-0004',
});


export default function CreateAccount() {
    const history = useHistory();

    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")

    const [mnemonicKey, setMnemonicKey] = useState<string>("")

    const onChangeName = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setName(newValue || '');
        } else {
            setName("")
        }
    }
    const onChangeUsername = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setUsername(newValue);
        } else {
            setUsername("")
        }
    }

    const createPrivateKey = () => {
        const mk = new MnemonicKey();
        const wallet = terra.wallet(mk);
        const m = mk.mnemonic
        setMnemonicKey(m)
        localStorage.setItem("address", wallet.key.accAddress);
        localStorage.setItem("mnemonic", mk.mnemonic);
    }

    const submit = async () => {
        if (!(name && username)) {
            globalEmitter.emit("notification", { type: "error", message: "Please fill out all fields" })
            return
        }

        try {
            const isUnique = await isUsernameUnique(username);
            if (isUnique.unique) {
                const response = await createNewUser(username, name);
                if (response.success) {
                    globalEmitter.emit("notification", { type: "success", message: "User has been successfully registered" })
                    globalEmitter.emit("notification", { type: "info", message: "Creating private wallet" })
                    createPrivateKey()
                }
            } else {
                globalEmitter.emit("notification", { type: "error", message: isUnique.message || "This username has already been registered" })
            }
        } catch (err) {
            globalEmitter.emit("notification", { type: "error", message: "There was an error with your request" })
        }
    }

    return (
        <div>
            <Text variant="xxLarge" styles={globalStyles.bold}>
                Create an account
            </Text>
            <TextField label="Your name" value={name} onChange={onChangeName} />
            <TextField label="Username" value={username} onChange={onChangeUsername} />

            {!mnemonicKey ? <PrimaryButton onClick={submit}>Submit</PrimaryButton> : null}

            {
                mnemonicKey ?
                    <>
                        <p>Write down this key. You will need it to recover your account:</p>
                        <p>{mnemonicKey}</p>
                        <PrimaryButton onClick={() => history.push('/dashboard')}>Next</PrimaryButton>
                    </> : null
            }
        </div>
    )
}