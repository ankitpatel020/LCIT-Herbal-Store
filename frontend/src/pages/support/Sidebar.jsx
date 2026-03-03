import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ loadingChats, chats, selectedChat, handleSelectChat }) => {
    return (
        <div className="w-1/3 bg-white border-r border-gray-100 flex flex-col min-w-[320px] max-w-sm shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="font-bold text-xl text-gray-800 tracking-tight">Messages</h2>
                <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">Exit App</Link>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loadingChats ? (
                    <div className="text-center p-8 text-gray-500 flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Loading inbox...</span>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 text-sm">No conversations found</div>
                ) : (
                    chats.map((chat) => {
                        const isSelected = selectedChat?._id === chat._id;
                        // Simulated unread count for UI showcase logic based on open status 
                        const isUnread = chat.status === 'open' && !isSelected;

                        return (
                            <div
                                key={chat._id}
                                onClick={() => handleSelectChat(chat)}
                                className={`relative p-5 border-b border-gray-50 cursor-pointer transition-all duration-200 group ${isSelected
                                        ? 'bg-emerald-50/50'
                                        : 'hover:bg-gray-50/80'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-md"></div>
                                )}

                                <div className="flex justify-between items-start mb-1 gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[15px]">
                                                {(chat.user?.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            {/* Online Indicator */}
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="min-w-0 pr-2 pt-0.5">
                                            <h4 className="font-semibold text-gray-900 truncate text-[15px]">
                                                {chat.user?.name || 'Unknown User'}
                                            </h4>
                                            <span className={`text-[10px] px-2 py-0.5 mt-0.5 inline-block rounded-full capitalize font-medium tracking-wide ${chat.status === 'open' ? 'bg-blue-50 text-blue-600' :
                                                    chat.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-gray-100 text-gray-500'
                                                }`}>
                                                {chat.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 shrink-0 pt-1">
                                        <span className={`text-[#9CA3AF] text-xs font-semibold ${isUnread ? 'text-emerald-500' : ''}`}>
                                            {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                        {/* Unread badge */}
                                        {isUnread && (
                                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                                                1
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pl-14 pt-1">
                                    <p className={`text-[14px] truncate flex-1 leading-snug ${isSelected || isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                        {chat.lastMessage?.text || 'No messages yet...'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Sidebar;