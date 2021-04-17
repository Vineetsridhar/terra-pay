import React, {useState} from "react";
import { LCDClient, Coin } from '@terra-money/terra.js';
import { PrimaryButton, Text } from '@fluentui/react'
import { globalStyles } from "../../assets/styles";
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import "./CreateAccount.css";
import { isUsernameUnique } from "../../helpers/network";
import { globalEmitter } from "../../helpers/emitter";

const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev/',
    chainID: 'tequila-0004',
});


export default function CreateAccount() {

    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")

    const onChangeName = (event:React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setName(newValue || '');
        }
    }
    const onChangeUsername = (event:React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setUsername(newValue || '');
        }
    }

    const submit = async () => {
        try{
            const isUnique = await isUsernameUnique(username);
            console.log(isUnique)
            if(isUnique.unique) {
                globalEmitter.emit("notification", {type:"error", message:"User has been successfully registered"})
            } else {
                globalEmitter.emit("notification", {type:"error", message:"That username has already been taken"})
            }
        } catch(err){
            globalEmitter.emit("notification", {type:"error", message:"There was an error with your request"})
        }

        console.log(name, username,)
    }

    return (
        <div>
            <Text variant="xxLarge" styles={globalStyles.bold}>
                Create an account
            </Text>
            <TextField label="Your name" value={name} onChange={onChangeName} />
            <TextField label="Username" value={username} onChange={onChangeUsername}/>

            <PrimaryButton onClick={submit}/>
        </div>
    )
}