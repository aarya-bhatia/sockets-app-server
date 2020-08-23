"use strict";

module.exports = class ChatController {

    constructor(chatModel) {
        // number of messages that can be queued before writing to the database.
        this.MAX_CHAT_QUEUE_SIZE = 50
        // Each map has a key equal to the chatId and a value equal to an array of messages.
        this.CHAT_QUEUE = new Map()
        this.Chat = chatModel
    }

    FETCH_CHATS = function (chatIds, callback) {
        this.Chat.find({ '_id': { $in: chatIds } }, function (err, chats) {
            if (err) callback(err, null);
            else callback(null, chats)
        })
    }

    SAVE_MESSAGES_TO_DB = function (chatId, callback) {
        this.Chat.findByIdAndUpdate(chatId,
            {
                $push:
                {
                    messages:
                    {
                        $each: prevMessages
                    }
                }
            },
            function (err, success) {
                if (err) callback(err, null);
                else callback(null, success);
            }
        )
    }

    SAVE_MESSAGE = function (chatId, message) {

        if (!this.CHAT_QUEUE.has(chatId)) {
            this.CHAT_QUEUE.set(chatId, [message]);
            return;
        }

        const prevMessages = this.CHAT_QUEUE.get(chatId)
        if (prevMessages.length > this.MAX_CHAT_QUEUE_SIZE) {
            // write to database
            SAVE_MESSAGES_TO_DB(chatId, function (err) {
                if (err) throw err;
                // clear the CHAT_QUEUE for this chatId &
                // optionally add the new message to queue
                else {
                    if (message) {
                        this.CHAT_QUEUE.set(chatId, [message])
                    } else {
                        this.CHAT_QUEUE.set(chatId, [])
                    }
                }
            })
        }
        else {
            // append the new message to exisiting queue 
            this.CHAT_QUEUE.set(chatId, [...prevMessages, newMessage])
        }
    }

}