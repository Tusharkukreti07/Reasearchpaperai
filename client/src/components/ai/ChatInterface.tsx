import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from '@/lib/icons';
import MessageBubble from './MessageBubble';
import TypeWriter from './TypeWriter';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  title?: string;
  isFullPage?: boolean;
  isExternalLink?: boolean;
  onExternalClick?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  title = "AI Research Assistant",
  isFullPage = false,
  isExternalLink = false,
  onExternalClick
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <Card className="overflow-hidden flex flex-col" style={isFullPage ? { height: 'calc(100vh - 180px)' } : { height: '400px' }}>
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        {isExternalLink && (
          <button 
            className="text-sm text-primary-600 hover:text-primary-700"
            onClick={onExternalClick}
          >
            <i className="ri-external-link-line"></i>
          </button>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-neutral-50">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              showTyping={message.isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your research papers..."
            className="pr-10"
          />
          <Button 
            type="submit"
            variant="ghost" 
            size="icon" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
