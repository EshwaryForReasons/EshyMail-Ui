import { randomHexColor } from "./utilities";

export var EMailboxFlags = {
	MBF_NONE 			: 0,
	MBF_NoSelect		: 1,
	MBF_HasNoChildren	: 2,
	MBF_All				: 4,
	MBF_Flagged			: 8,
	MBF_Important		: 16,
	MBF_Marked			: 32,
	MBF_Sent			: 64,
	MBF_Draft			: 128,
	MBF_Junk			: 256,
	MBF_Trash			: 512,
};

export function Mailbox(name, flags) {
	this.name = name;
	this.flags = flags;
	this.selected = false;
}

export function Account(accountPtr, email, name, mailboxes, userConfig) {
	this.accountPtr = accountPtr;
	this.email = email;
	this.name = name;
	this.selected = false;
	this.mailboxes = mailboxes;
	this.userConfig = userConfig != null ? userConfig : {
		color: randomHexColor()
	};
}

export function MessageHeader(accountPtr, uid, sender, subject, date, seen, flagged) {
	this.accountPtr = accountPtr;
	this.uid = uid;
	this.sender = sender;
	this.subject = subject;
	this.date = date;
	this.selected = false;
	this.seen = seen;
	this.flagged = flagged;
}

export function EmailContent(subject, content) {
	this.subject = subject;
	this.content = content;
}