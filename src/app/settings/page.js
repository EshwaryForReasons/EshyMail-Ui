"use client"

import { useEffect, useState } from "react";
import { Button } from "C/components/ui/button"
import { Input } from "C/components/ui/input"
import { Label } from "C/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C/components/ui/tabs"
import AccountsPage from "./accounts_tab"
import {Account} from "C/components/data_structures"

export default function Settings() {
	const [accounts, setAccounts] = useState([]);

    const jsAddSettingsAccount = (accountPtr, email) => {
		setAccounts(prevAccounts => [
			...prevAccounts,
			new Account(accountPtr, email, "")
		]);
	};

    const jsRemoveComposeAccount = (email) => {
		setAccounts(prevAccounts => prevAccounts.filter(prevAccount => prevAccount.email !== email));
    };

    var b_ran = false;
	useEffect(() => {
		if(b_ran)
			return;

		b_ran = true;

		window.cefRegisterFunc("jsAddSettingsAccount", jsAddSettingsAccount);
		window.cefRegisterFunc("jsRemoveSettingsAccount", jsRemoveComposeAccount);
		window.cefUpdateSettingsAccountList();
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