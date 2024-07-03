import { useState } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const NoOutlineTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'solid #dddddd 2px',
            borderRadius: '0px'
        },
        '&:hover fieldset': {
            border: 'solid #dddddd 2px',
            borderRadius: '0px'
        },
        '&.Mui-focused fieldset': {
            border: 'solid #dddddd 2px',
            borderRadius: '0px'
        },
    },
});

const MultiEmailTextField = ({emails, setEmails}) => {
    const [inputValue, setInputValue] = useState('');

    const isValidEmail = (email) => {
        const email_validation_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email_validation_regex.test(email);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();

            const email = inputValue.trim();
            if (email && isValidEmail(email) && !emails.includes(email)) {
                setEmails([...emails, email]);
                setInputValue('');
            }
        }
    };

    const handleDeleteEmail = (emailToDelete) => () => {
        setEmails(emails.filter(email => email !== emailToDelete));
    };

    const renderEmailsInTextField = () => {
        const mainStyle = {
            backgroundColor: '#dddddd',
            display: 'inline-block',
            padding: '5px',
            marginRight: "10px",
            borderRadius: "10px",
        };
        
        const deleterStyle = { 
            marginLeft: '5px',
            cursor: 'pointer'
        };

        return emails.map((email, index) => (
            <div key={index} style={mainStyle}>
                {email}
                <span style={deleterStyle} onClick={handleDeleteEmail(email)}>&#10005;</span>
            </div>
        ));
    };

    return (
        <NoOutlineTextField
            fullWidth
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Emails"
            InputProps={{
                startAdornment: renderEmailsInTextField(),
            }}
        />
    );
};

export default MultiEmailTextField;