"use client"

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C/components/ui/tabs"
import AccountsPage from "./accounts_tab"
import {Mailbox, Account} from "C/components/data_structures"

export default function Settings() {
	const [accounts, setAccounts] = useState([]);

    const jsAddSettingsAccount = (accountPtr, email, name, serializedMailboxes) => {
        const deserializeIndividual = (individualSerializedMailbox) => {
			const delimiter_pos = individualSerializedMailbox.indexOf("&&");
			const name = individualSerializedMailbox.substring(0, delimiter_pos);
			const flags = parseInt(individualSerializedMailbox.substring(delimiter_pos + 2));
			return new Mailbox(name, flags);
		};
		setAccounts(prevAccounts => [...prevAccounts, new Account(accountPtr, email, name, serializedMailboxes.split("&&&&").map(deserializeIndividual))]);
	};

    const jsRemoveComposeAccount = (email) => {
		setAccounts(prevAccounts => prevAccounts.filter(prevAccount => prevAccount.email !== email));
    };

    var b_ran = false;
	useEffect(() => {
		if(b_ran)
			return;

		b_ran = true;

		window.cefRegisterFunc("RemoveSettingsAccount", jsRemoveComposeAccount);
		
        window.cefGetAccountList((accountPtr, email, name, serializedMailboxes) => {
			const deserializeIndividual = (individualSerializedMailbox) => {
				const delimiter_pos = individualSerializedMailbox.indexOf("&&");
				const name = individualSerializedMailbox.substring(0, delimiter_pos);
				const flags = parseInt(individualSerializedMailbox.substring(delimiter_pos + 2));
				return new Mailbox(name, flags);
			};
			setAccounts(prevAccounts => [...prevAccounts, new Account(accountPtr, email, name, serializedMailboxes.split("&&&&").map(deserializeIndividual))]);
		});
	}, []);

    return (
        <div style={{padding: "100px"}}>
            <Tabs defaultValue="accounts" className="main">
                <TabsList>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts">
                    <AccountsPage accounts={accounts} setAccounts={setAccounts} />
                </TabsContent>
                
                <TabsContent value="data">

                </TabsContent>
            </Tabs>
        </div>
    )
}