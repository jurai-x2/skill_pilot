// aiMentor.tsx (Updated Frontend to Work with Pica API)

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, X, User, Send, Loader, Paperclip } from 'lucide-react';
import { ChatMessage, FileAttachment } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';

interface AIMentorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function AIMentor({ isOpen, onClose, currentLanguage = 'en' }: AIMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const t = useTranslation(currentLanguage);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantId = "asst_abc123"; // Replace with your real assistant ID

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          assistantId,
          threadId,
          userId: user?.id || 'guest_user'
        })
      });

      const data = await response.json();
      const newMessage: ChatMessage = {
        id: data.message?.id || Date.now().toString(),
        content: data.message?.content?.[0]?.text?.value || "I'm here to help!",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      if (data.threadId) setThreadId(data.threadId);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "❌ Couldn’t reach AI.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">AI Mentor</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-gray-200 rounded-xl animate-pulse">Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              rows={2}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !inputMessage.trim()}
              className="p-3 bg-primary text-white rounded-md"
            >
              {isTyping ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
