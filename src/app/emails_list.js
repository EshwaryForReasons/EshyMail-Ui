import { useState } from "react";
import { Checkbox } from "C/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "C/components/ui/table"
import "C/styles/emails_list.scss"

export default function EmailsList({ accounts, messageHeaders }) {
	//I don't understand react so I've added this here to force rerenders
	const [counter, setCounter] = useState(0);

	const loadEmail = (messageHeader) =>
		window.cefLoadEmail(messageHeader.accountPtr, messageHeader.uid);

	const getSortedMessageHeaders = () =>
		[].concat(messageHeaders).sort((a, b) => a.date < b.date ? 1 : -1);

	const renderMessageHeaderRow = (messageHeader) => {
		const onCheckedChange = (enabled) => {
			messageHeader.selected = enabled;
			setCounter(prevCounter => prevCounter + 1);
		};

		const color = messageHeader.selected ? "#cccccc" : accounts.find(acc => acc.accountPtr === messageHeader.accountPtr)?.userConfig.color;
		return (
			<TableRow key={messageHeader.accountPtr + messageHeader.uid} className={`email-delegate h-[40px]`} style={{backgroundColor: color}}>
				<TableCell>
					<Checkbox className={"mr-2.5 rounded"} onCheckedChange={onCheckedChange} />
				</TableCell>
				<TableCell onClick={() => loadEmail(messageHeader)}>
					<div className={`status-symbol ${!messageHeader.seen && "unread"}`}></div>
				</TableCell>
				<TableCell onClick={() => loadEmail(messageHeader)}>
					<div className={`status-symbol ${messageHeader.flagged && "flagged"}`}></div>
				</TableCell>
				<TableCell onClick={() => loadEmail(messageHeader)} className="max-w-[150px] truncate sm:table-cell">
					<span className="sender-name truncate">{messageHeader.sender}</span>
				</TableCell>
				<TableCell onClick={() => loadEmail(messageHeader)} className="hidden sm:table-cell">
					<span className="subject">{messageHeader.subject}</span>
				</TableCell>
			</TableRow>
		);
	}

	return (
		<div className="email-list">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[10px]"></TableHead>
						<TableHead className="w-[10px]"></TableHead>
						<TableHead className="w-[10px]"></TableHead>
						<TableHead className="w-2.5 truncate">Name</TableHead>
						<TableHead className="truncate">Subject</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{getSortedMessageHeaders().map(messageHeader => renderMessageHeaderRow(messageHeader))}
				</TableBody>
			</Table>
		</div>
	);
}