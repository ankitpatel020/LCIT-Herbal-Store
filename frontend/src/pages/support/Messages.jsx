import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const Messages = ({ messages, messagesEndRef }) => {
    return (
        <div className="p-6 md:p-8 space-y-5 max-w-5xl mx-auto flex flex-col tracking-[-0.01em]">
            {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-16 mt-10">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                        <FiMessageSquare size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-2">No messages yet</h3>
                    <p className="font-medium text-[15px]">Start the conversation below.</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    // Check if sender is support staff
                    const isStaff = ['admin', 'agent', 'support'].includes(msg.sender?.role);

                    // Logic to detect consecutive messages from the same sender to adjust bubble rounding
                    const isFirstInSequence = index === 0 || messages[index - 1]?.sender?._id !== msg.sender?._id;
                    const isLastInSequence = index === messages.length - 1 || messages[index + 1]?.sender?._id !== msg.sender?._id;

                    const bubbleClasses = isStaff
                        ? `bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.2)] ${isFirstInSequence ? 'rounded-tl-[24px]' : 'rounded-tl-[8px]'} ${isLastInSequence ? 'rounded-bl-[24px] rounded-tr-[24px] rounded-br-[6px]' : 'rounded-r-[24px] rounded-l-[8px]'}`
                        : `bg-white border border-gray-100 text-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${isFirstInSequence ? 'rounded-tr-[24px]' : 'rounded-tr-[8px]'} ${isLastInSequence ? 'rounded-br-[24px] rounded-tl-[24px] rounded-bl-[6px]' : 'rounded-l-[24px] rounded-r-[8px]'}`;

                    return (
                        <div key={index} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'} ${!isFirstInSequence ? '-mt-[10px]' : ''}`}>
                            {isFirstInSequence && !isStaff && (
                                <span className="text-[12px] text-gray-400 font-semibold mb-2 ml-2 uppercase tracking-wide">
                                    {msg.sender?.name}
                                </span>
                            )}

                            <div className={`flex max-w-[80%] md:max-w-[70%] ${isStaff ? 'justify-end' : 'justify-start'} group relative items-end`}>
                                {/* Out-of-bubble timestamp on hover */}
                                <div className={`absolute bottom-[-2px] ${isStaff ? 'right-full mr-4' : 'left-full ml-4'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[11px] text-gray-400 whitespace-nowrap font-medium pointer-events-none`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                <div className={`px-5 py-3.5 ${bubbleClasses} transition-all duration-200 hover:shadow-lg`}>
                                    <p className="break-words whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {msg.text}
                                    </p>

                                    {/* Inside-bubble tiny timestamp (visible mostly on last msgs) */}
                                    {(isLastInSequence || msg.text.length > 50) && (
                                        <div className={`flex items-center gap-1.5 mt-2 justify-end`}>
                                            <p className={`text-[10px] font-bold tracking-wider ${isStaff ? 'text-emerald-100' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} className="h-6" />
        </div>
    );
};

export default Messages;
