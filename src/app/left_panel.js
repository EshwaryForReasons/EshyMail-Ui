import {Separator} from "C/components/ui/separator"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "C/components/ui/select"
import {EMailboxFlags} from 'C/components/data_structures'
import "C/styles/left_panel.scss"

export default function LeftPanel({accounts, setAccounts, setMessageHeaders}) {
    const onAccountChanged = (newAccountPtr) => {
        setMessageHeaders([]);
        window.cefSelectAccount(newAccountPtr);
        for(let i in accounts) {
            accounts[i].selected = false;
            if(accounts[i].accountPtr == newAccountPtr) {
                accounts[i].selected = true;
            }
        }
    };

    const onMailboxChanged = (selectedMailbox) => {
        setAccounts(prevAccounts => prevAccounts.map(account => 
            account.selected ? {...account, mailboxes: account.mailboxes.map(mailbox => ({
                ...mailbox,
                selected: mailbox.name == selectedMailbox.name
            }))} : account
        ));
    };

    const onComposeClicked = () =>
        window.open("http://localhost:3000/compose");

    const onSettingsClicked = () =>
        window.open("http://localhost:3000/settings");

	return (
        <div className="left-panel">
            <div className="w-full h-[35px] flex items-center p-[10px] bg-[#121212] hover:bg-[#444444] active:bg-[#222222]" onClick={onComposeClicked}>
                <p>Compose</p>
            </div>

            <div className="w-full h-[35px] mt-[10px]">
                <Select onValueChange={onAccountChanged}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Accounts</SelectLabel>
                    {accounts.map(account => <SelectItem key={account.accountPtr} value={account.accountPtr}>{account.email}</SelectItem>)}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>

            <br/>
            <Separator/>
            <br/>
            
            <div className="w-full h-full flex flex-col justify-between">
                <div className="w-full grid grid-flow-row gap-[5px]">
                    {accounts.filter(account => account.selected)[0]?.mailboxes?.filter(mailbox => !(mailbox.flags & EMailboxFlags.MBF_NoSelect))?.map(mailbox => (
                        <div key={mailbox.name}
                        className={`"w-full h-[35px] flex items-center p-[10px] bg-[#121212] hover:bg-[#444444] active:bg-[#222222]" ${mailbox.selected && "selected"}`}
                        onClick={() => onMailboxChanged(mailbox)}>
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
