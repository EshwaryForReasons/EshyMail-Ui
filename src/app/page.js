"use client"

import { useEffect, useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "C/components/ui/resizable"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "C/components/ui/context-menu"
import { Account, MessageHeader, EmailContent } from "C/components/data_structures"
import LeftPanel from "./left_panel"
import EmailsList from "./emails_list"
import "C/styles/main.scss"

const EmailView = ({ emailContent }) => (
	<div className="email-view">
		{emailContent.subject != "" &&
			<div className="email-subject">
				<p>{"Subject: " + emailContent.subject}</p>
			</div>
		}
		<div dangerouslySetInnerHTML={{ __html: emailContent.content }}></div>
	</div>
);

export default function Home() {
	//I don't understand react so I've added this here to force rerenders
    const [counter, setCounter] = useState(0);

	const [accounts, setAccounts] = useState([new Account("unified", "Unified", "Unified")]);
	const [messageHeaders, setMessageHeaders] = useState([]);
	const [emailContent, setEmailContent] = useState(new EmailContent("<no subject>", ""));

	const jsAddAccount = (accountPtr, email) =>
		setAccounts(prevAccounts => [...prevAccounts, new Account(accountPtr, email, "")]);

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
		const dirtyMessageHeader = messageHeaders.filter(messageHeader => messageHeader.accountPtr == accountPtr && messageHeader.uid == uid)[0];
		dirtyMessageHeader.seen = seen;
		dirtyMessageHeader.flagged = flagged;
		setCounter(prevCounter => prevCounter + 1);

		// setMessageHeaders(prevMessageHeaders => {
		// 	return prevMessageHeaders.map(messageHeader => {
		// 		if (messageHeader.accountPtr == accountPtr && messageHeader.uid == uid) {
		// 			return {
		// 				...messageHeader,
		// 				seen: seen,
		// 				flagged: flagged
		// 			};
		// 		} else {
		// 			return messageHeader;
		// 		}
		// 	});
		// });
	};

	var b_ran = false;
	useEffect(() => {
		if (b_ran)
			return;

		b_ran = true;
		window.cefRegisterFunc("jsAddAccount", jsAddAccount);
		window.cefRegisterFunc("jsRemoveAccount", jsRemoveAccount);
		window.cefRegisterFunc("jsAddMessageHeader", jsAddMessageHeader);
		window.cefRegisterFunc("jsUpdateEmailContent", jsUpdateEmailContent);
		window.cefRegisterFunc("jsUpdateMessageHeader", jsUpdateMessageHeader);
		window.cefUpdateAccountList();
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
			<LeftPanel accounts={accounts} setMessageHeaders={setMessageHeaders} />
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