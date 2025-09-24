import React, { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types/index';
import { MessageSquare, Bot } from 'lucide-react';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

interface AIChatPanelProps {
  messages: ChatMessageType[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isAiTyping: boolean;
  sampleQuestions: string[];
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  messages,
  input,
  onInputChange,
  onSubmit,
  isAiTyping,
  sampleQuestions,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 h-fit flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
              <p className="text-gray-600 text-sm">Ask about staff productivity</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <p className="font-medium mb-4">Ask me anything about your team!</p>
              <div className="space-y-2 text-xs">
                {sampleQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onInputChange(question)}
                    className="block w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    💡 {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-sm px-4 py-3 text-sm ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                    }`}
                  >
                    {message.text.includes('**') ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>'),
                        }}
                      />
                    ) : (
                      message.text
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isAiTyping && (<TypingIndicator/>)}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

       <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          disabled={isAiTyping}
        />
      </div>
    </div>
  );
};

export default AIChatPanel;
