import { useState } from "react"
import { Separator } from "C/components/ui/separator"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "C/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "C/components/ui/avatar"
import { EMailboxFlags } from 'C/components/data_structures'
import { openWindow } from 'C/components/utilities'
import "C/styles/left_panel.scss"

export default function LeftPanel({ accounts, setAccounts, setMessageHeaders }) {
	const [composeWindowProxy, setComposeWindowProxy] = useState(null);
	const [settingsWindowProxy, setSettingsWindowProxy] = useState(null);

	const onAccountChanged = (newAccountPtr) => {
		setMessageHeaders([]);
		setAccounts(prevAccounts => prevAccounts.map(prevAccount => ({
			...prevAccount,
			selected: newAccountPtr === prevAccount.accountPtr
		})));

		const newSelectedAccount = accounts.find(account => account.accountPtr === newAccountPtr);
		if (newSelectedAccount) {
			const inbox = newSelectedAccount.mailboxes?.find(mailbox => mailbox.name.toLowerCase().includes("inbox"))
			if (inbox) onMailboxAccountChanged(newSelectedAccount, inbox);
		}
	};

	const onMailboxAccountChanged = (account, selectedMailbox) => {
		if (!account)
			return;

		setMessageHeaders([]);
		window.cefSelectMailbox(account.accountPtr, selectedMailbox.name);
		setAccounts(prevAccounts => prevAccounts.map(prevAccount =>
			prevAccount.email == account.email ? {
				...prevAccount, mailboxes: prevAccount.mailboxes.map(mailbox => ({
					...mailbox,
					selected: mailbox.name === selectedMailbox.name
				}))
			} : prevAccount
		));
	};

	const onSelectedAccountMailboxChanged = (selectedMailbox) => {
		const selectedAccount = accounts.find(account => account.selected);
		if (selectedAccount) onMailboxAccountChanged(selectedAccount, selectedMailbox);
	};

	const getSortedMailboxes = () => {
		const selectedAccount = accounts.find(account => account.selected);
		if (!selectedAccount)
			return [];

		const withoutNoSelect = selectedAccount.mailboxes?.filter(mailbox => !(mailbox.flags & EMailboxFlags.MBF_NoSelect));
		
		//Order: Inbox, Important, All other folders, Sent, Junk (Spam), Trash
		const inbox = withoutNoSelect.find(mailbox => mailbox.name.toLowerCase().includes("inbox"))
		const important = withoutNoSelect.find(mailbox => mailbox.flags & EMailboxFlags.MBF_Important);
		const sent = withoutNoSelect.find(mailbox => mailbox.flags & EMailboxFlags.MBF_Sent);
		const junk = withoutNoSelect.find(mailbox => mailbox.flags & EMailboxFlags.MBF_Junk);
		const trash = withoutNoSelect.find(mailbox => mailbox.flags & EMailboxFlags.MBF_Trash);

		let finalArray = [];
		if (inbox) finalArray.push(inbox);
		if (important) finalArray.push(important);
		withoutNoSelect.filter(mailbox => 
			(mailbox.name != inbox?.name) &&
			(mailbox.name != important?.name) &&
			(mailbox.name != sent?.name) &&
			(mailbox.name != junk?.name) &&
			(mailbox.name != trash?.name)).map(mailbox => finalArray.push(mailbox));
		if (sent) finalArray.push(sent);
		if (junk) finalArray.push(junk);
		if (trash) finalArray.push(trash);
		return finalArray;
	};

	const onComposeClicked = () =>
		openWindow(`http://localhost:${window.cefGetPort()}/compose${window.cefIsProductionMode() ? '.html' : ''}`, composeWindowProxy, setComposeWindowProxy);

	const onSettingsClicked = () =>
		openWindow(`http://localhost:${window.cefGetPort()}/settings${window.cefIsProductionMode() ? '.html' : ''}`, settingsWindowProxy, setSettingsWindowProxy);

	return (
		<div className="left-panel">
			<div className="w-full h-[35px] flex items-center p-[10px] bg-[#121212] hover:bg-[#444444] active:bg-[#222222]" onClick={onComposeClicked}>
				<p>Compose</p>
			</div>

			<div className="w-full h-[50px] mt-[10px]">
				<Select onValueChange={onAccountChanged}>
					<SelectTrigger className="h-[50px]">
						<SelectValue placeholder="Select Account" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Accounts</SelectLabel>
							{accounts.map(account => <SelectItem key={account.accountPtr} value={account.accountPtr}>
								<div className="flex flex-row align-middle w-[400px]">
									<Avatar>
										<AvatarImage src={account.profilePictureUrl} />
										<AvatarFallback>Profile</AvatarFallback>
									</Avatar>
									<div className="h-50 my-auto ml-2.5">{account.name} ({account.email})</div>
								</div>
							</SelectItem>)}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<br />
			<Separator />
			<br />

			<div className="w-full h-full flex flex-col justify-between">
				<div className="w-full grid grid-flow-row gap-[5px]">
					{getSortedMailboxes()?.map(mailbox => (
						<div key={mailbox.name}
							className={`"w-full h-[35px] flex items-center p-[10px] bg-[#121212] hover:bg-[#444444] active:bg-[#222222]" ${mailbox.selected && "selected"}`}
							onClick={() => onSelectedAccountMailboxChanged(mailbox)}>
							<p>{mailbox.name.substring(mailbox.name.lastIndexOf("/") + 1)}</p>
						</div>
					))}
				</div>

				<div className="w-full h-[35px] flex items-center p-[10px] bg-[#121212] hover:bg-[#444444] active:bg-[#222222]" onClick={() => onSettingsClicked()}>
					<p>Settings</p>
				</div>
			</div>
		</div>
	);
}
