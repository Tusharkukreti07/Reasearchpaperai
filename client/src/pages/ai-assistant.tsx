import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface, { Message } from '@/components/ai/ChatInterface';
import { useAIChat, useChats } from '@/hooks/useAIChat';
import { usePapers } from '@/hooks/usePapers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PaperIcon, ChatIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

const AIAssistant: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([]);
  const { messages, sendMessage } = useAIChat(selectedChatId);
  const { data: chats, isLoading: isChatsLoading } = useChats();
  const { data: papers, isLoading: isPapersLoading } = usePapers();
  
  const handleSendMessage = (content: string) => {
    sendMessage(content, selectedPaperIds.length > 0 ? selectedPaperIds : undefined);
  };
  
  const handlePaperToggle = (paperId: number) => {
    setSelectedPaperIds(prev => 
      prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };
  
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId === 'new' ? null : parseInt(chatId));
  };
  
  return (
    <Layout title="AI Research Assistant">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)]">
        {/* Sidebar with chats and papers */}
        <div className="w-full md:w-64 lg:w-80 flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <Select onValueChange={handleChatSelect} defaultValue={selectedChatId?.toString() || 'new'}>
              <SelectTrigger>
                <SelectValue placeholder="Select a chat or start a new one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Chat</SelectItem>
                {!isChatsLoading && chats && chats.map((chat: any) => (
                  <SelectItem key={chat.id} value={chat.id.toString()}>
                    {chat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <PaperIcon className="w-4 h-4 mr-1.5" />
              Select papers for context
            </h3>
            
            {isPapersLoading ? (
              <p className="text-sm text-neutral-500">Loading papers...</p>
            ) : papers && papers.length > 0 ? (
              <div className="space-y-2">
                {papers.map(paper => (
                  <div key={paper.id} className="flex items-start">
                    <Checkbox 
                      id={`paper-${paper.id}`}
                      checked={selectedPaperIds.includes(paper.id)}
                      onCheckedChange={() => handlePaperToggle(paper.id)}
                      className="mt-0.5 mr-2"
                    />
                    <Label 
                      htmlFor={`paper-${paper.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      <span className="line-clamp-2">{paper.title}</span>
                      <span className="block text-xs text-neutral-500">
                        {formatDate(paper.uploadDate)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No papers available. Upload some papers first.</p>
            )}
          </div>
          
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <p className="text-xs text-neutral-500">
              The AI assistant will answer based on the papers you've selected. For general questions, you don't need to select any papers.
            </p>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="font-semibold text-lg flex items-center">
                <ChatIcon className="w-5 h-5 mr-2 text-primary-600" />
                {selectedChatId ? 'Continuing Conversation' : 'New Conversation'}
              </h3>
              {selectedPaperIds.length > 0 && (
                <p className="text-sm text-neutral-500 mt-1">
                  Using context from {selectedPaperIds.length} selected paper{selectedPaperIds.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto bg-neutral-50">
                  <div className="flex flex-col space-y-4">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-6 max-w-md">
                          <div className="mx-auto w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                            <RobotIcon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Research AI Assistant</h3>
                          <p className="text-neutral-600 mb-4">
                            I can help you understand papers, compare research, extract insights, and answer questions about your academic content.
                          </p>
                          <p className="text-sm text-neutral-500">
                            Select papers from the sidebar for context-specific answers.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} showTyping={message.isLoading} />
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-neutral-200">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSendMessage(input.value);
                      input.value = '';
                    }
                  }} className="relative">
                    <input
                      name="message"
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ask about your research papers..."
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700">
                      <i className="ri-send-plane-fill"></i>
                    </button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// Import these components to ensure they're available
import { RobotIcon } from '@/lib/icons';
import MessageBubble from '@/components/ai/MessageBubble';

export default AIAssistant;
