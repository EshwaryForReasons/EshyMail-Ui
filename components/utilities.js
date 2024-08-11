
import { Account, Mailbox } from 'C/components/data_structures'

export const randomHexColor = () =>
    "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

export const openWindow = (url, proxyVar, proxySetter) => {
    if (proxyVar === null || proxyVar.closed) {
        proxySetter(window.open(url));
    } else {
        proxyVar.focus();
    }
}

export const updateAccountsList = (accountsVar, accountsSetter) => {
    accountsSetter([]);
    const parseMailboxes = (serializedMailboxes) => JSON.parse(serializedMailboxes).map(mailbox => new Mailbox(mailbox.name, mailbox.flags));
    window.cefGetAccountList((accountPtr, email, name, serializedMailboxes, userConfig) =>
        accountsSetter(prevAccounts => [...prevAccounts, new Account(accountPtr, email, name, parseMailboxes(serializedMailboxes), JSON.parse(userConfig))]));
}