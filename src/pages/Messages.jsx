import React, { useEffect, useState } from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import { fetchProfile, fetchInbox, fetchUserById, getOrCreateConversation } from '../services/api';
import ChatBox from '../components/ChatBox';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUsername = localStorage.getItem('username');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUsername || !currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await fetchProfile(currentUsername);
        const current = profileRes.data;
        setCurrentUser(current);

        const inboxRes = await fetchInbox(currentUserId);
        const inbox = inboxRes.data || [];

        const inboxContacts = inbox.map((conversation) => {
          const otherUser = conversation.participants.find((participant) => participant._id !== currentUserId) || {};
          return {
            id: otherUser._id,
            username: otherUser.username,
            displayName: otherUser.displayName,
            profilePicture: otherUser.profilePicture,
            avatar: otherUser.avatar,
            conversationId: conversation._id,
            lastMessage: conversation.lastMessage?.text || 'No messages yet',
            time: conversation.lastMessage?.createdAt
              ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''
          };
        });

        const existingContactIds = new Set(inboxContacts.map((contact) => contact.id?.toString()));
        const followingIds = current.following || [];

        const followingContacts = await Promise.all(
          followingIds
            .filter((id) => !existingContactIds.has(id.toString()))
            .map(async (id) => {
              try {
                const res = await fetchUserById(id);
                const user = res.data;
                return {
                  id: user._id,
                  username: user.username,
                  displayName: user.displayName,
                  profilePicture: user.profilePicture,
                  avatar: user.avatar,
                  conversationId: null,
                  lastMessage: 'Start a conversation',
                  time: ''
                };
              } catch (err) {
                console.error('Failed to fetch following connection', id, err);
                return null;
              }
            })
        );

        setContacts([...inboxContacts, ...followingContacts.filter(Boolean)]);
      } catch (err) {
        console.error('Failed to load messages inbox', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentUsername, currentUserId]);

  const handleSelectContact = async (contact) => {
    setActiveContact(contact);

    if (contact.conversationId) {
      setConversationId(contact.conversationId);
      return;
    }

    try {
      const res = await getOrCreateConversation(currentUserId, contact.id);
      const convo = res.data;
      setConversationId(convo._id);
      setContacts((prev) => prev.map((item) =>
        item.id === contact.id ? { ...item, conversationId: convo._id } : item
      ));
    } catch (err) {
      console.error('Failed to start conversation', err);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      contact.displayName?.toLowerCase().includes(q) ||
      contact.username?.toLowerCase().includes(q)
    );
  });

  if (!currentUsername || !currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef4ff] p-6">
        <div className="max-w-xl w-full bg-white rounded-[2rem] p-10 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Login to access your messages</h2>
          <p className="text-slate-500">Your followed connections will appear here once you sign in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef4ff] py-6">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <aside className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] overflow-hidden">
            <div className="px-6 py-6 bg-[#eff6ff] border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
              <p className="text-sm text-slate-500 mt-1">Chat with your followed connections.</p>
              <div className="mt-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search connections"
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/20 shadow-sm"
                />
              </div>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-slate-500">Loading conversations...</div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`w-full text-left flex items-center gap-3 px-5 py-4 transition-all ${activeContact?.id === contact.id ? 'bg-[#eff6ff]' : 'hover:bg-[#eff6ff]/70'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#e5e7eb] flex items-center justify-center overflow-hidden text-white text-sm font-bold">
                      {contact.profilePicture ? (
                        <img
                          src={contact.profilePicture.startsWith('http') ? contact.profilePicture : `${import.meta.env.VITE_API_URL}/${contact.profilePicture}`}
                          alt={contact.displayName || contact.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (contact.displayName || contact.username || '?')[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{contact.displayName || contact.username}</h3>
                        <span className="text-[11px] text-slate-400">{contact.time}</span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-1">{contact.lastMessage}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">
                  {currentUser?.following?.length > 0
                    ? 'No conversations yet. Tap a connection to start messaging.'
                    : 'You are not following anyone yet. Follow someone to message them.'}
                </div>
              )}
            </div>
          </aside>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] min-h-[70vh] overflow-hidden">
            {activeContact ? (
              <ChatBox
                conversationId={conversationId}
                currentUser={currentUser}
                recipient={activeContact}
                onClose={() => setActiveContact(null)}
              />
            ) : (
              <div className="flex h-full min-h-[32rem] flex-col items-center justify-center px-10 text-center text-slate-500">
                <div className="w-24 h-24 rounded-full bg-[#eff6ff] flex items-center justify-center mb-5 text-3xl text-[#0f4c81]">
                  <UserIcon size={34} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Your messages live here</h2>
                <p className="mt-3 max-w-lg text-sm leading-6">
                  Select a followed connection from the left to open the chat. New conversations can be started immediately.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;
