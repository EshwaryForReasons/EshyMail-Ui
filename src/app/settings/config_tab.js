"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "C/components/ui/card"
import { updateAccountsList } from "C/components/utilities"
import "C/styles/settings.scss"

export default function ConfigPage({ broadcastChannel }) {
	const [accounts, setAccounts] = useState([]);
	const [color, setColor] = useState([]);

	const onAccountConfigUpdated = () => {
		window.cefUpdateAccountConfig();
	}

	var b_ran = false;
	useEffect(() => {
		if (b_ran)
			return;

		b_ran = true;
		updateAccountsList(accounts, setAccounts);
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Configuration
				</CardTitle>
			</CardHeader>
			<CardContent>
				<input type="color" onChange={event => setColor(event.target.value)}></input>
			</CardContent>
		</Card>
	)
}