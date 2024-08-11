"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C/components/ui/tabs"
import AccountsPage from "./accounts_tab"
import ConfigPage from "./config_tab"

export default function Settings() {
	const [broadcastChannel, setBroadcastChannel] = useState(new BroadcastChannel("mainChannel"));

    return (
        <div style={{padding: "100px"}}>
            <Tabs defaultValue="accounts" className="main">
                <TabsList>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    <TabsTrigger value="config">Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts">
                    <AccountsPage broadcastChannel={broadcastChannel} />
                </TabsContent>
                
                <TabsContent value="config">
                    <ConfigPage broadcastChannel={broadcastChannel} />
                </TabsContent>
            </Tabs>
        </div>
    )
}