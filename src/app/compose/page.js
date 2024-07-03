"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "C/components/ui/select"
import { Button } from '@mui/material';
import MultiEmailTextField, {NoOutlineTextField} from './multi_email_text_field';
import "react-quill/dist/quill.snow.css"
import {Account} from "C/components/data_structures"
import "C/styles/compose.scss"

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

export default function Compose() {
	const [accounts, setAccounts] = useState([]);
	const [emails, setEmails] = useState([]);
	const [subject, setSubject] = useState('');
	const [content, setContent] = useState('');

	const onSendToAccountChanged = (newAccountPtr) => {
        for (let i in accounts) {
            accounts[i].selected = false;
            if (accounts[i].accountPtr == newAccountPtr) {
                accounts[i].selected = true;
            }
        }
    };
	
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ align: [] }],
			[{ color: [] }],
			[{ fontsize: [] }]
			['clean']
		]
	};

	const quillFormats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'link',
		'align',
		'color',
		'code-block',
	];

	const handleEditorContentChange = (newContent) => {
		setContent(newContent);
	};

	const handleSubjectChange = (event) => {
		setSubject(event.target.value);
	};

	const onSendButtonClicked = () => {
		if (subject === "" || content === "") {
			alert("Email needs a subject and content");
			return;
		}

		const accountPtr = accounts.find(account => account.selected)?.accountPtr || "none";
		const emailsList = emails.map(email => email).join(',');
		window.cefSendEmail(accountPtr, emailsList, subject, content);
	};

	const onSaveDraftButtonClicked = () => {

	};

	const jsAddComposeAccount = (accountPtr, email) => {
		setAccounts(prevAccounts => [
			...prevAccounts,
			new Account(accountPtr, email, "")
		]);
	};

	const jsRemoveComposeAccount = (email) => {
		setAccounts(prevAccounts => prevAccounts.filter(prevAccount => prevAccount.email !== email));
	};

	var b_ran = false;
	useEffect(() => {
		if(b_ran)
			return;

		b_ran = true;

		window.cefRegisterFunc("jsAddComposeAccount", jsAddComposeAccount);
		window.cefRegisterFunc("jsRemoveComposeAccount", jsRemoveComposeAccount);
		window.cefUpdateComposeAccountList();
	}, []);

	return (
		<div className="main">
			<div className="top">
				<div className="send-from">
					<span className="label">Send from: </span>
					<Select onValueChange={onSendToAccountChanged}>
					<SelectTrigger className="w-60">
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

				<MultiEmailTextField emails={emails} setEmails={setEmails} />
				<NoOutlineTextField fullWidth placeholder="Subject" onChange={handleSubjectChange} />
			</div>

			<div className="quill-editor">
				<QuillEditor onChange={handleEditorContentChange} modules={quillModules} formats={quillFormats} />
			</div>

			<div className="actions">
				<Button variant="contained" onClick={onSendButtonClicked}>Send</Button>
				<Button variant="contained" onClick={onSaveDraftButtonClicked}>Save Draft</Button>
			</div>
		</div>
	);
}