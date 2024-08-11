"use client"

import { useEffect, useState } from "react";
import { Button } from "C/components/ui/button"
import { Checkbox } from "C/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "C/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "C/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "C/components/ui/table"
import { Label } from "C/components/ui/label"
import { Input } from "C/components/ui/input"
import { Carousel, CarouselContent, CarouselItem } from "C/components/ui/carousel";
import { CiSettings } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { FaYahoo } from "react-icons/fa";
import { updateAccountsList } from "C/components/utilities";
import "C/styles/settings.scss"

export default function AccountsPage({ broadcastChannel }) {
	//I don't understand react so I've added this here to force rerenders
	const [counter, setCounter] = useState(0);
	const [accounts, setAccounts] = useState([]);
	const [carouselApi, setCarouselApi] = useState(null);

	const onAccountsListUpdated = () => {
		updateAccountsList(accounts, setAccounts);
		broadcastChannel.postMessage("accountsListUpdated");
	}

	const onAddAccount = () => {
		const firstName = window.document.getElementById("first-name").value;
		const email = window.document.getElementById("email").value;
		const imapsUrl = window.document.getElementById("imaps-url").value;
		const smtpsUrl = window.document.getElementById("smtps-url").value;
		const password = window.document.getElementById("password").value;
		window.cefAddAccount(firstName, email, imapsUrl, smtpsUrl, password, onAccountsListUpdated);
	};

	const onAddGoogleAccount = () =>
		window.cefAddGoogleAccount(onAccountsListUpdated);
	const onAddMicrosoftAccount = () =>
		window.cefAddMicrosoftAccount(onAccountsListUpdated);
	const onAddYahooAccount = () =>
		window.cefAddYahooAccount(onAccountsListUpdated);

	const onDeleteAcconts = () => {
		const selectedAccounts = accounts.filter(account => account.selected);
		const emailsList = selectedAccounts.map(account => account.email).join(',');
		window.cefDeleteAccounts(emailsList, onAccountsListUpdated);
	};

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
					Accounts
					<div className="grid grid-cols-2 w-72 gap-2 float-right">
						<Dialog>
							<DialogTrigger asChild>
								<Button className="button">Add Account</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Add Account</DialogTitle>
								</DialogHeader>
								<Carousel className="h-[500px]" setApi={setCarouselApi}>
									<CarouselContent>
										<CarouselItem key={0}>
											<div className="grid gap-4 h-full flex content-center">
												<Button className="w-full button flex justify-center" variant="outline" onClick={onAddGoogleAccount}>
													<FcGoogle /><p>Add Google Account</p>
												</Button>
												<Button className="w-full button flex justify-center" variant="outline" onClick={onAddMicrosoftAccount}>
													<FaMicrosoft /><p>Add Microsoft Account</p>
												</Button>
												<Button className="w-full button flex justify-center" variant="outline" onClick={onAddYahooAccount}>
													<FaYahoo /><p>Add Yahoo Account</p>
												</Button>
												<Button className="w-full button" variant="outline" onClick={() => carouselApi.scrollTo(1)}>Add Account Manually</Button>
											</div>
										</CarouselItem>
										<CarouselItem key={1}>
											<div className="grid gap-5">
												<div className="grid gap-2">
													<Label htmlFor="first-name">Account Name</Label>
													<Input id="first-name" placeholder="John Smith" required />
												</div>
												<div className="grid gap-2">
													<Label htmlFor="email">Email</Label>
													<Input id="email" type="email" placeholder="email@example.com" required />
												</div>
												<div className="grid gap-2">
													<Label htmlFor="email">IMAPS URL</Label>
													<Input id="imaps-url" type="url" placeholder="imaps://imap.provider.com" required />
												</div>
												<div className="grid gap-2">
													<Label htmlFor="email">SMTPS URL</Label>
													<Input id="smtps-url" type="url" placeholder="smtps://smtps.provider.com" required />
												</div>
												<div className="grid gap-2">
													<Label htmlFor="password">Password</Label>
													<Input id="password" type="password" />
												</div>
												<Button type="submit" className="w-full button" onClick={onAddAccount}>Add Account</Button>
												<Button className="w-full button" variant="outline" onClick={() => carouselApi.scrollTo(0)}>Go Back</Button>
											</div>
										</CarouselItem>
									</CarouselContent>
								</Carousel>
							</DialogContent>
						</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button className="button">Delete Accounts</Button>
							</DialogTrigger>
							{accounts.filter(account => account.selected).length === 0 ? (
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>No accounts selected</DialogTitle>
										<DialogDescription>
											Please select accounts before attempting to delete them!
										</DialogDescription>
									</DialogHeader>
									<DialogClose type="submit" className="bg-accent w-full button h-10">Go Back</DialogClose>
								</DialogContent>
							) : (
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Are you sure?</DialogTitle>
										<DialogDescription>
											This will delete the following accounts and the corresponding data:
											{accounts.filter(account => account.selected).map(acc => <li key={acc.email}>{acc.email}</li>)}
										</DialogDescription>
									</DialogHeader>
									<div className="grid grid-cols-2 gap-4">
										<DialogClose type="submit" className="bg-accent w-full button">Cancel</DialogClose>
										<Button type="submit" className="w-full button" onClick={onDeleteAcconts}>Delete Accounts</Button>
									</div>
								</DialogContent>
							)}
						</Dialog>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{accounts.map(account => (
							<TableRow key={account.email} style={{ height: "40px" }} className={"" + (account.selected ? "bg-accent" : "")}>
								<TableCell style={{ width: "40px" }} className="hidden sm:table-cell">
									<Checkbox onCheckedChange={(enabled) => {
										setCounter(prevCounter => prevCounter + 1);
										account.selected = enabled;
									}} style={{ borderRadius: "5px" }}></Checkbox>
								</TableCell>
								<TableCell>
									<div className="font-medium">{account.name}</div>
								</TableCell>
								<TableCell className="hidden sm:table-cell">
									{account.email}
								</TableCell>
								<TableCell style={{ width: "40px" }}>
									<Dialog>
										<DialogTrigger asChild>
											<Button className="w-min button" variant="outline">
												<CiSettings />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[800px]">
											<DialogHeader>
												<DialogTitle>{account.email} Settings</DialogTitle>
											</DialogHeader>
											<div className="grid grid-cols-2 gap-2 w-24">
												<p>Color:</p>
												<input type="color" value={account.userConfig.color} onChange={event => {
													setAccounts(prevAccounts => prevAccounts.map(prevAccount => 
														prevAccount.email == account.email ? {
															...prevAccount,
															userConfig: {
																...prevAccount.userConfig,
																color: event.target.value
															}
														} : prevAccount
													));
												}} />
											</div>
											<div className="grid grid-cols-2 gap-4 w-96 align-right">
												<DialogClose type="submit" className="bg-accent button">Cancel</DialogClose>
												<Button type="submit" className="button" onClick={() => {
													window.cefUpdateAccountConfig(account.accountPtr, JSON.stringify(account.mailboxes), JSON.stringify(account.userConfig), () => {
														console.log("Sending update message");
														broadcastChannel.postMessage("accountsListUpdated")
													}
														);
												}}>Save Changes</Button>
											</div>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}