import React from 'react';
import styled from 'styled-components';

export default function Message({message, timestamp, username, userImage}) {
    // console.log("Message component message: ", message, " timestamp: ", timestamp, " username: ", username, " userImage: ", userImage);
    return (
        <MessageContainer>
            <img src={userImage} alt="" />
            <MessageInfo>
                <h4>
                    {username} <span>{new Date(timestamp).toUTCString()}</span>
                </h4>
                <p>{message}</p>            
            </MessageInfo>
        </MessageContainer>
    
    )
}

const MessageContainer = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 20px;

    > img {
        height: 50px;
        border-radius: 8px;
    }
`;

const MessageInfo = styled.div`
    padding-left: 10px;
    text-align: left;

    > h4 > span {
        color: gray;
        font-weight: 300;
        margin-left: 4px;
        font-size: 10px;
    }
`;