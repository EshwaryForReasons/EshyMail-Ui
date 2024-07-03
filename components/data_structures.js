export function Account(accountPtr, email, name) {
	this.accountPtr = accountPtr;
	this.email = email;
	this.name = name;
	this.selected = false;
	this.color = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
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