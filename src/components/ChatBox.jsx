import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User } from 'lucide-react';
import { io } from 'socket.io-client';
import { sendMessage, fetchMessages } from '../services/api';

const socket = io(import.meta.env.VITE_API_URL);

const ChatBox = ({ conversationId, currentUser, recipient, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  const avatarUrl = (user) => {
    const src = user?.profilePicture || user?.avatar;
    return src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_URL}/${src}`) : null;
  };

  useEffect(() => {
    if (conversationId) {
      socket.emit('join_conversation', conversationId);

      const loadMessages = async () => {
        try {
          const res = await fetchMessages(conversationId);
          setMessages(res.data);
        } catch (err) {
          console.error('History fetch failed', err);
        }
      };

      loadMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    socket.on('receive_msg', (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.off('receive_msg');
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId,
      sender: currentUser._id,
      text: newMessage,
      createdAt: new Date(),
    };

    try {
      await sendMessage(messageData);
      socket.emit('send_msg', messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
    } catch (err) {
      console.error('Send error', err);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-softgray bg-[#eff6ff] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#E5E7EB] overflow-hidden">
            {avatarUrl(recipient) ? (
              <img
                src={avatarUrl(recipient)}
                alt={recipient?.displayName || recipient?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-muted">
                {recipient?.displayName?.charAt(0) || recipient?.username?.charAt(0) || <User size={20} />}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-charcoal">{recipient?.displayName || recipient?.username}</h3>
            <p className="text-sm text-slate-muted">{recipient?.username ? `@${recipient.username}` : 'Connection chat'}</p>
          </div>
        </div>
        <button onClick={onClose} className="h-10 w-10 rounded-full border border-softgray text-slate-muted hover:bg-cool-gray transition">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#eef4ff] p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-softgray bg-cool-gray p-8 text-center text-slate-muted">
            No messages yet. Start the conversation by sending a message.
          </div>
        ) : (
          messages.map((msg, index) => {
            const fromMe = msg.sender === currentUser._id;
            return (
              <div key={index} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${fromMe ? 'bg-[#0f4c81] text-white' : 'bg-cool-gray text-charcoal border border-softgray'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-softgray bg-cool-gray px-6 py-5">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 rounded-full border border-softgray bg-[#F8FAFC] px-4 py-3 text-sm text-slate-muted outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20"
          />
          <button type="submit" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f4c81] text-white shadow-md hover:bg-[#084182] transition">
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;

