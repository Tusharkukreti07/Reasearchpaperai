import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/components/ai/ChatInterface';
import { generateRandomId } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

interface Chat {
  id: number;
  title: string;
  createdAt: string;
}

interface NewChat {
  userId: number;
  title: string;
}

interface ChatMessage {
  id: number;
  chatId: number;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export function useChats() {
  return useQuery({
    queryKey: ['/api/chats'],
  });
}

export function useChat(id: number | null) {
  const { data: messages } = useQuery({
    queryKey: id ? [`/api/chats/${id}/messages`] : null,
    enabled: !!id,
  });

  return {
    messages: messages as ChatMessage[]
  };
}

export function useAIChat(chatId?: number) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(chatId || null);
  const queryClient = useQueryClient();

  // Load existing messages if chat exists
  const { messages: apiMessages } = useChat(currentChatId);

  // Create a new chat
  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/chats', {
        userId: 1, // Using demo user ID since we don't have authentication
        title
      });
      return response.json();
    },
    onSuccess: (newChat: Chat) => {
      setCurrentChatId(newChat.id);
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
    }
  });

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, paperIds }: { content: string, paperIds?: number[] }) => {
      if (!currentChatId) {
        // Create a new chat first if none exists
        const newChat = await createChatMutation.mutateAsync('New Chat ' + new Date().toLocaleString());
        const response = await apiRequest('POST', `/api/chats/${newChat.id}/messages`, {
          chatId: newChat.id,
          content,
          role: 'user',
          paperIds
        });
        return response.json();
      } else {
        const response = await apiRequest('POST', `/api/chats/${currentChatId}/messages`, {
          chatId: currentChatId,
          content,
          role: 'user',
          paperIds
        });
        return response.json();
      }
    },
    onSuccess: () => {
      if (currentChatId) {
        queryClient.invalidateQueries({ queryKey: [`/api/chats/${currentChatId}/messages`] });
      }
    }
  });

  // Convert API messages to local format
  useEffect(() => {
    if (apiMessages) {
      const formattedMessages = apiMessages.map(msg => ({
        id: msg.id.toString(),
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.createdAt)
      }));
      setLocalMessages(formattedMessages);
    }
  }, [apiMessages]);

  const sendMessage = async (content: string, paperIds?: number[]) => {
    // Add user message to local state immediately
    const userMessageId = generateRandomId();
    const userMessage: Message = {
      id: userMessageId,
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add a loading assistant message
    const assistantMessageId = generateRandomId();
    const loadingMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };
    
    setLocalMessages(prev => [...prev, userMessage, loadingMessage]);
    
    // Send to API
    try {
      await sendMessageMutation.mutateAsync({ content, paperIds });
    } catch (error) {
      // If there's an error, replace the loading message with an error
      setLocalMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId
          ? { ...msg, content: "I'm sorry, I couldn't process your request. Please try again.", isLoading: false }
          : msg
      ));
    }
  };

  return {
    messages: localMessages,
    sendMessage,
    isLoading: sendMessageMutation.isPending
  };
}
