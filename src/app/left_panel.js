import "C/styles/left_panel.scss"

import { useState } from "react";
import {Separator} from "C/components/ui/separator"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "C/components/ui/select"

export default function LeftPanel({accounts, setMessageHeaders}) {
    const [mailboxes, setMailboxes] = useState([
        {name: "Inbox", selected: true},
        {name: "Drafts", selected: false},
        {name: "Sent", selected: false},
        {name: "Spam", selected: false},
        {name: "Trash", selected: false},
    ]);

    const accountChanged = (newAccountPtr) => {
        setMessageHeaders([]);
        window.cefSelectAccount(newAccountPtr);
        for(let i in accounts) {
            accounts[i].selected = false;
            if(accounts[i].accountPtr == newAccountPtr) {
                accounts[i].selected = true;
            }
        }
    };

    const onComposeClicked = () => {
        window.open("http://localhost:3000/compose");
    };

    const onMailboxSelected = (selectedMailbox) => {
        setMailboxes(prevMailboxes =>
			prevMailboxes.map(mailbox =>
				({...mailbox, selected: mailbox.name === selectedMailbox.name})
			)
		);
    };

    const onSettingsClicked = () => {
        window.open("http://localhost:3000/settings");
    };

	return (
        <div className="left-panel">
            <div className="button" onClick={onComposeClicked}>
                <p>Compose</p>
            </div>

            <div className="account-selection">
                <Select onValueChange={accountChanged}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    {accounts.map(account => (
                        <SelectItem key={account.accountPtr} value={account.accountPtr}>{account.email}</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>

            <br/>
            <Separator/>
            <br/>
            
            <div className="mailboxes">
                {mailboxes.map(mailbox => (
                    <div key={mailbox.name} className={"button " + (mailbox.selected ? "selected" : "")} onClick={() => onMailboxSelected(mailbox)}>
                        <p>{mailbox.name}</p>
                    </div>
                ))}
            </div>

            <div>
                <div className="button" onClick={() => onSettingsClicked()}>
                    <p>Settings</p>
                </div>
            </div>
        </div>
	);
}
