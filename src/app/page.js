"use client"

import { useEffect, useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "C/components/ui/resizable"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "C/components/ui/context-menu"
import { Account, MessageHeader, EmailContent } from "C/components/data_structures"
import { updateAccountsList } from "C/components/utilities"
import LeftPanel from "./left_panel"
import EmailsList from "./emails_list"

export const EmailView = ({ emailData }) => (
	<div className="scrollbar-thin h-screen w-full float-right overflow-y-auto text-[#121212] bg-[#ffffff]">
		{emailData.subject !== "" &&
			<div className="flex items-center font-bold w-full p-1 pl-4 shadow-xl">
				<p>{"Subject: " + emailData.subject}</p>
			</div>
		}
		<div className="px-10" dangerouslySetInnerHTML={{ __html: emailData.content }}></div>
	</div>
);

export default function Home() {
	//I don't understand react so I've added this here to force rerenders
  const [counter, setCounter] = useState(0);

	const [accounts, setAccounts] = useState([new Account("unified", "Unified", "Unified")]);
	const [messageHeaders, setMessageHeaders] = useState([]);
	const [emailContent, setEmailContent] = useState(new EmailContent("", ""));
	const [broadcastChannel, setBroadcastChannel] = useState(new BroadcastChannel("mainChannel"));
	
	const jsAddMessageHeader = (accountPtr, uid, sender, subject, date, seen, flagged) => {
		setMessageHeaders(prevMessageHeaders => [
			...prevMessageHeaders,
			new MessageHeader(accountPtr, uid, sender, subject, BigInt(date), seen, flagged)
		]);
	};

	const jsUpdateEmailContent = (uid, subject, content) => {
		console.log("email received here");
		console.log("Email gotten", content);
		setEmailContent(new EmailContent(subject, content));
	}

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

		window.cefRegisterFunc("AddMessageHeader", jsAddMessageHeader);
		window.cefRegisterFunc("UpdateEmailContent", jsUpdateEmailContent);
		window.cefRegisterFunc("UpdateMessageHeader", jsUpdateMessageHeader);
		updateAccountsList(accounts, setAccounts);

		broadcastChannel.onmessage = (message) => {
			if (message.data === "accountsListUpdated") {
				updateAccountsList(accounts, setAccounts);
			}
		};
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
		<div className="flex flex-row">
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
					<EmailView emailData={emailContent} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}