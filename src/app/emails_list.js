import { useState } from "react";
import { Checkbox } from "C/components/ui/checkbox"
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
		
		const color = accounts.find(acc => acc.accountPtr === messageHeader.accountPtr)?.color;
		const selectedColor = "#cccccc";
		return (
			<div
				key={messageHeader.accountPtr + messageHeader.uid}
				//className={`email-delegate ${`bg-[${messageHeader.selected ? selectedColor : color}]`}`}
				className={"email-delegate " + (messageHeader.selected ? "selected" : "")}
				style={{ backgroundColor: color}}
				onClick={() => loadEmail(messageHeader)}>
				<Checkbox className={"mr-2.5 rounded"} onCheckedChange={onCheckedChange} />
				<span className={`mr-2.5 w-2.5 h-2.5 rounded-full ${!messageHeader.seen && `bg-[#8e80db]`}`}></span>
				<span className={`mr-2.5 w-2.5 h-2.5 rounded-full ${messageHeader.flagged && `bg-[#f6ff74]`}`}></span>
				<span className="sender-name">{messageHeader.sender}</span>
				<span className="subject">{messageHeader.subject}</span>
			</div>
		);
	}

	return (
		<div className="email-list-panel">
			<div className="email-list">
				{getSortedMessageHeaders().map(messageHeader => renderMessageHeaderRow(messageHeader))}
			</div>
		</div>
	);
}