import React from 'react';
import { FiClock, FiUser, FiCheckCircle, FiSend, FiMessageSquare, FiMoreVertical } from 'react-icons/fi';
import Messages from './Messages';

const Chat = ({
    selectedChat,
    handleAssign,
    handleCloseChat,
    messages,
    sendMessage,
    newMessage,
    setNewMessage,
    messagesEndRef
}) => {
    if (!selectedChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50/80 flex-col gap-6">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-200">
                    <FiMessageSquare size={36} />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Messages</h3>
                    <p className="text-gray-500 text-[15px] max-w-sm">Select a conversation from the sidebar to start chatting with customers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50/30 relative">
            {/* Chat Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-white/95 backdrop-blur-xl sticky top-0 z-20 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-b border-gray-100">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0 hidden sm:block">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {(selectedChat.user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate flex items-center gap-2">
                            {selectedChat.user?.name || 'User'}
                            <span className="text-sm font-normal text-gray-400">({selectedChat.user?.email})</span>
                        </h3>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><FiClock className="text-gray-400" /> {selectedChat.status}</span>
                            {selectedChat.assignedTo && (
                                <span className="flex items-center gap-1 text-emerald-600"><FiUser /> Assigned to: {selectedChat.assignedTo.name}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0 items-center">
                    {!selectedChat.assignedTo && selectedChat.status !== 'closed' && (
                        <button
                            onClick={() => handleAssign(selectedChat._id)}
                            className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-[0_4px_14px_rgba(0,0,0,0.1)] active:scale-95"
                        >
                            Assign to Me
                        </button>
                    )}
                    {selectedChat.status !== 'closed' && (
                        <button
                            onClick={() => handleCloseChat(selectedChat._id)}
                            className="bg-white border text-gray-700 border-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm flex items-center gap-1.5 active:scale-95"
                        >
                            <FiCheckCircle /> Close
                        </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors ml-1">
                        <FiMoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                <Messages messages={messages} messagesEndRef={messagesEndRef} />
            </div>

            {/* Input Area */}
            {selectedChat.status !== 'closed' ? (
                <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 sticky bottom-0 z-20">
                    <form onSubmit={sendMessage} className="flex gap-3 max-w-5xl mx-auto items-end relative">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-[24px] relative focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-200 shadow-sm">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(e);
                                    }
                                }}
                                placeholder="Write a reply... (Press Enter to send)"
                                className="w-full bg-transparent px-5 py-4 focus:outline-none resize-none max-h-32 min-h-[56px] text-gray-800 placeholder-gray-400 text-[15px] leading-relaxed rounded-[24px]"
                                rows="1"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="text-white w-14 h-[56px] rounded-[24px] flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:bg-gray-200 disabled:shadow-none bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] shrink-0 active:scale-95"
                        >
                            <FiSend size={20} className="translate-x-[-1px] translate-y-[1px]" />
                        </button>
                    </form>
                    <div className="text-center mt-3 mb-1 text-[11px] text-gray-400 font-medium tracking-wide">
                        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-sans shadow-sm mx-0.5">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-sans shadow-sm mx-0.5">Shift + Enter</kbd> for new line
                    </div>
                </div>
            ) : (
                <div className="p-5 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-[15px] font-medium sticky bottom-0">
                    This conversation has been closed and cannot be replied to.
                </div>
            )}
        </div>
    );
};

export default Chat;
