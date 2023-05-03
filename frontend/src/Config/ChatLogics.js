const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}

const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}


const isSameSenderMargin = (messages, m, i, userId) => {
    if (i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId)
        return 33;
    else if ((i < messages.length - 1 && messages[i + 1].sender._id !== m.sender.id &&
        messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId))
        return 0;
    else return 'auto';
}

const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
}

const getSender = (loggedUser, users) => {
    if (!users || users.length !== 2) return null;
    const otherUser = users.find(user => user._id !== loggedUser._id);
    console.log(otherUser)
    return otherUser ? otherUser.name : null;
}

const getSenderFull = (loggedUser, users) => {
    return loggedUser._id === users[0]._id ? users[1] : users[0];
}

module.exports = { getSender, getSenderFull, isSameSender, isLastMessage, isSameSenderMargin, isSameUser };