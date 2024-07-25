"use client"

import { useEffect, useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "C/components/ui/resizable"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "C/components/ui/context-menu"
import { Mailbox, Account, MessageHeader, EmailContent } from "C/components/data_structures"
import LeftPanel from "./left_panel"
import EmailsList from "./emails_list"
import "C/styles/main.scss"

const EmailView = ({ emailContent }) => (
	<div className="scrollbar-thin h-screen w-full float-right overflow-y-auto text-[#121212] bg-[#ffffff]">
		{emailContent.subject != "" &&
			<div className="flex items-center font-bold w-full p-1 pl-4">
				<p>{"Subject: " + emailContent.subject}</p>
			</div>
		}
		<div className="px-10" dangerouslySetInnerHTML={{ __html: emailContent.content }}></div>
	</div>
);

export default function Home() {
	//I don't understand react so I've added this here to force rerenders
    const [counter, setCounter] = useState(0);

	const [accounts, setAccounts] = useState([new Account("unified", "Unified", "Unified")]);
	const [messageHeaders, setMessageHeaders] = useState([]);
	const [emailContent, setEmailContent] = useState(new EmailContent("<no subject>", ""));

	const jsAddAccount = (accountPtr, email, name, serializedMailboxes) => {
		const deserializeIndividual = (individualSerializedMailbox) => {
			const delimiter_pos = individualSerializedMailbox.indexOf("&&");
			const name = individualSerializedMailbox.substring(0, delimiter_pos);
			const flags = parseInt(individualSerializedMailbox.substring(delimiter_pos + 2));
			return new Mailbox(name, flags);
		};
		setAccounts(prevAccounts => [...prevAccounts, new Account(accountPtr, email, name, serializedMailboxes.split("&&&&").map(deserializeIndividual))]);
	}

	const jsRemoveAccount = (email) =>
		setAccounts(prevAccounts => prevAccounts.filter(prevAccount => prevAccount.email !== email));

	const jsAddMessageHeader = (accountPtr, uid, sender, subject, date, seen, flagged) => {
		setMessageHeaders(prevMessageHeaders => [
			...prevMessageHeaders,
			new MessageHeader(accountPtr, uid, sender, subject, BigInt(date), seen, flagged)
		]);
	};

	const jsUpdateEmailContent = (uid, subject, emailContent) =>
		setEmailContent(new EmailContent(subject, emailContent));

	const jsUpdateMessageHeader = (accountPtr, uid, seen, flagged) => {
		setMessageHeaders(prevMessageHeaders =>
			prevMessageHeaders.map(messageHeader => {
				const bUpdateThisOne = messageHeader.accountPtr == accountPtr && messageHeader.uid == uid;
				return bUpdateThisOne ? { ...messageHeader, seen: seen, flagged: flagged} : messageHeader;
			})
		);
	};

	var b_ran = false;
	useEffect(() => {
		if (b_ran)
			return;

		b_ran = true;
		window.cefRegisterFunc("RemoveAccount", jsRemoveAccount);
		window.cefRegisterFunc("AddMessageHeader", jsAddMessageHeader);
		window.cefRegisterFunc("UpdateEmailContent", jsUpdateEmailContent);
		window.cefRegisterFunc("UpdateMessageHeader", jsUpdateMessageHeader);

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

	const loadMoreMessageHeaders = () =>
		window.cefLoadMoreMessageHeaders(accounts.find(account => account.selected)?.accountPtr || "unified");

	const toggleEmailSeenStatus = () =>
		messageHeaders.filter(messageHeader => messageHeader.selected).forEach(messageHeader => 
			window.cefSetEmailSeenStatus(messageHeader.accountPtr, messageHeader.uid, !messageHeader.seen))

	const toggleEmailFlaggedStatus = () =>
		messageHeaders.filter(messageHeader => messageHeader.selected).forEach(messageHeader => 
			window.cefSetEmailFlaggedStatus(messageHeader.accountPtr, messageHeader.uid, !messageHeader.flagged));

	return (
		<div className="main">
			<LeftPanel accounts={accounts} setAccounts={setAccounts} setMessageHeaders={setMessageHeaders} />
			<ResizablePanelGroup
				direction="horizontal"
				className="rounded-lg border">
				<ResizablePanel defaultSize={50}>
					<ContextMenu>
						<ContextMenuTrigger>
							<EmailsList accounts={accounts} messageHeaders={messageHeaders} />
						</ContextMenuTrigger>
						<ContextMenuContent className="w-64 rounded-xl">
							<ContextMenuItem inset onClick={() => toggleEmailSeenStatus()}>Mark unread</ContextMenuItem>
							<ContextMenuItem inset onClick={() => toggleEmailFlaggedStatus()}>Mark flagged</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem inset onClick={() => loadMoreMessageHeaders()}>Load more emails</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={50}>
					<EmailView emailContent={emailContent} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}