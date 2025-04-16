import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserIcon, RobotIcon } from '@/lib/icons';
import TypeWriter from './TypeWriter';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
  showTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showTyping = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start max-w-[90%] ${isUser ? 'self-end' : ''}`}>
      {!isUser && (
        <Avatar className="flex-shrink-0 w-8 h-8 bg-purple-500">
          <AvatarFallback className="text-white">
            <RobotIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`mx-3 p-3 rounded-lg shadow-sm ${
        isUser ? 'bg-primary-50' : 'bg-white'
      }`}>
        {showTyping ? (
          <TypeWriter />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      
      {isUser && (
        <Avatar className="flex-shrink-0 w-8 h-8 bg-primary-600">
          <AvatarFallback className="text-white">
            <UserIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
