"use client"

import { useState } from "react";
import { Button } from "C/components/ui/button"
import { Checkbox } from "C/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "C/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "C/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "C/components/ui/table"
import { Label } from "C/components/ui/label"
import { Input } from "C/components/ui/input"
import "C/styles/settings.scss"

export default function AccountsPage({accounts}) {
    //I don't understand react so I've added this here to force rerenders
    const [counter, setCounter] = useState(0);

    const onAddAccount = () => {
        const first_name = window.document.getElementById("first-name").value;
        const email = window.document.getElementById("email").value;
        const imaps_url = window.document.getElementById("imaps-url").value;
        const smtps_url = window.document.getElementById("smtps-url").value;
        const password = window.document.getElementById("password").value;
        window.cefAddAccount(first_name, email, imaps_url, smtps_url, password);
    };

    const onAddGoogleAccount = () => window.cefAddGoogleAccount();
    const onAddMicrosoftAccount = () => window.cefAddMicrosoftAccount();
    const onAddYahooAccount = () => window.cefAddYahooAccount();

    const onDeleteAcconts = () => {
        const selectedAccounts = accounts.filter(account => account.selected);
        const emailsList = selectedAccounts.map(account => account.email).join(',');
        window.cefDeleteAccounts(emailsList);
    };

    const renderAccountRow = (account) => {
        const onCheckedChange = (enabled) => {
            setCounter(prevCounter => prevCounter + 1);
            account.selected = enabled;
        };

        return (
            <TableRow key={account.email} style={{ height: "40px" }} className={"" + (account.selected ? "bg-accent" : "")}>
                <TableCell style={{ width: "40px" }} className="hidden sm:table-cell">
                    <Checkbox onCheckedChange={onCheckedChange} style={{ borderRadius: "5px" }}></Checkbox>
                </TableCell>
                <TableCell>
                    <div className="font-medium">{account.name}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    {account.email}
                </TableCell>
            </TableRow>
        );
    };

    const AddAccountDialog = () => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="button">Add Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Account</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
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
                        <Button className="w-full button" variant="outline" onClick={onAddGoogleAccount}>Add Google Account</Button>
                        <Button className="w-full button" variant="outline" onClick={onAddMicrosoftAccount}>Add Microsoft Account</Button>
                        <Button className="w-full button" variant="outline" onClick={onAddYahooAccount}>Add Yahoo Account</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    };

    const DeleteAccountDialog = () => {
        const selectedAccounts = accounts.filter(account => account.selected);

        const noSelectedAccountsCase = () => {
            return (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>No accounts selected</DialogTitle>
                        <DialogDescription>
                            Please select accounts before attempting to delete them!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogClose type="submit" className="bg-accent w-full button h-10">Go Back</DialogClose>
                </DialogContent>
            )
        };

        const defaultCase = () => {
            return (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will delete the following accounts and the corresponding data:
                            {accounts.filter(account => account.selected).map(acc => <li>{acc.email}</li>)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <DialogClose type="submit" className="bg-accent w-full button">Cancel</DialogClose>
                        <Button type="submit" className="w-full button" onClick={onDeleteAcconts}>Delete Accounts</Button>
                    </div>
                </DialogContent>
            )
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="button">Delete Accounts</Button>
                </DialogTrigger>
                {selectedAccounts.length === 0 ? noSelectedAccountsCase() : defaultCase()}
            </Dialog>
        )
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Accounts
                    <div className="grid grid-cols-2 w-72 gap-2 float-right">
                        {AddAccountDialog()}
                        {DeleteAccountDialog()}
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map(account => renderAccountRow(account))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}