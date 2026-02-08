'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LogOut, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/utils/auth';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  fullContent?: string; // For storing the complete response
  isTyping?: boolean;   // Flag to indicate typing animation
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState('dia-base');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize the router
  // Add this new state for the typing animation
  const [titleText, setTitleText] = useState("");
  const fullTitleText = "Hi, I'm Dia!";
  const [showCursor, setShowCursor] = useState(true);
  
  // Improved typing animation effect for the title
  useEffect(() => {
    if (messages.length === 0) {
      let isTyping = true;
      let index = 0;
      let direction = 1; // 1 for typing, -1 for erasing
      
      // Toggle cursor visibility for a more natural blinking effect
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      const typingInterval = setInterval(() => {
        if (direction === 1) {
          // Typing forward
          if (index <= fullTitleText.length) {
            setTitleText(fullTitleText.substring(0, index));
            index += direction;
          } else {
            // Pause at the end before erasing
            setTimeout(() => {
              direction = -1;
            }, 2000);
          }
        } else {
          // Erasing
          if (index > 0) {
            setTitleText(fullTitleText.substring(0, index));
            index += direction;
          } else {
            // Pause before typing again
            setTimeout(() => {
              direction = 1;
            }, 500);
          }
        }
      }, 100); // Slightly faster for smoother appearance
      
      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [messages.length]);
  
  // Then update the Dia text in the UI
  const preWrittenTopics = [
    {
      title: "What are the advantages",
      subtitle: "of using therapy?",
      prompt: "I've been considering therapy but I'm not sure about the advantages. Can you tell me more about how it might help me?"
    },
    {
      title: "Help me manage anxiety",
      subtitle: "about social situations",
      prompt: "I have anxiety about social situations and it's affecting my daily life. How can I start to manage this?"
    },
    {
      title: "I'm feeling overwhelmed",
      subtitle: "with work and life balance",
      prompt: "I'm feeling overwhelmed trying to balance work and personal life. Everything feels like too much right now."
    },
    {
      title: "How to improve sleep",
      subtitle: "when stressed",
      prompt: "I've been having trouble sleeping because of stress. What techniques might help me get better rest?"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add the bot message with empty content initially
      const botResponse = data.response;
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: '', 
          fullContent: botResponse,
          isTyping: true 
        },
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request.' 
        },
      ]);
      setIsLoading(false);
    }
  };

  // Add typing animation effect
  useEffect(() => {
    const typingMessages = messages.filter(m => m.isTyping && m.fullContent);
    
    if (typingMessages.length === 0) return;
    
    const currentMessage = typingMessages[0];
    const fullText = currentMessage.fullContent || '';
    const currentText = currentMessage.content;
    
    if (currentText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setMessages(msgs => 
          msgs.map(m => 
            m === currentMessage 
              ? { 
                  ...m, 
                  content: fullText.substring(0, currentText.length + 1),
                  isTyping: currentText.length + 1 < fullText.length
                }
              : m
          )
        );
      }, 15); // Adjust speed of typing here
      
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (currentUser && currentUser.name) {
      // Extract first name (split by space and take first part)
      return currentUser.name.split(' ')[0];
    }
    return 'User';
  };

  const startNewSession = (initialPrompt?: string) => {
    setMessages([]);
    
    // Add initial greeting from the therapist bot
    setIsLoading(true);
    
    setTimeout(() => {
      setMessages([{
        role: 'assistant',
        content: '',
        fullContent: "Hello there! I'm Dia, your digital companion. How are you feeling today? I'm here to listen and support you through whatever you might be experiencing.",
        isTyping: true
      }]);
      
      // If there's an initial prompt, add it after a delay
      if (initialPrompt) {
        setTimeout(() => {
          const userMessage = { role: 'user' as const, content: initialPrompt };
          setMessages(prev => [...prev, userMessage]);
          
          // Simulate bot response to the initial prompt
          setTimeout(() => {
            setIsLoading(true);
            
            // Make the actual API call
            fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: initialPrompt }),
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              setMessages(prev => [
                ...prev,
                { 
                  role: 'assistant', 
                  content: '', 
                  fullContent: data.response,
                  isTyping: true 
                }
              ]);
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error sending message:', error);
              setMessages(prev => [
                ...prev,
                { 
                  role: 'assistant', 
                  content: 'Sorry, there was an error processing your request.' 
                }
              ]);
              setIsLoading(false);
            });
          }, 1000);
        }, 2000);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const endSession = () => {
    // Add final message from Dia
    setIsLoading(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: '', 
          fullContent: "Thank you for reaching out today. Good luck with everything going forward. Take care.",
          isTyping: true 
        }
      ]);
      
      // Reset to initial state after a delay to allow reading the message
      setTimeout(() => {
        setMessages([]);
        setIsLoading(false);
      }, 5000);
      
      setIsLoading(false);
    }, 1000);
  };

  // Check if user is logged in
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Add navigation functions
  const navigateToLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setShowUserDropdown(false);
    // Optional: redirect to login or home page
    // router.push('/login');
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    }
  };

  // Initialize theme on component mount
  useEffect(() => {
    // Set initial dark mode class
    document.documentElement.classList.add('dark-mode');
  }, []);

  return (
    <div className={`flex-1 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} min-h-screen p-4`}>
      {/* Top navigation without header container */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <button 
            className={`flex items-center ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 border border-slate-300'} px-4 py-2 rounded-md text-base cursor-pointer`}
            onClick={() => setShowModelDropdown(!showModelDropdown)}
          >
            {selectedModel} <ChevronDown size={18} className="ml-2" />
          </button>
          
          {showModelDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 rounded-md shadow-lg z-10 w-full">
              <div 
                className="p-2 text-white text-sm border-b border-slate-700 cursor-pointer hover:bg-slate-700"
                onClick={() => {
                  setSelectedModel('dia-base');
                  setShowModelDropdown(false);
                }}
              >
                dia-base
              </div>
              <div className="p-2 text-slate-400 text-sm flex items-center">
                dia-genz <span className="ml-2 text-xs bg-slate-700 px-2 py-0.5 rounded">Soon</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-900 border border-slate-300'} rounded-full flex items-center justify-center cursor-pointer`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {messages.length > 0 && (
            <button
              onClick={endSession}
              className={`${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'} py-2 px-4 rounded-md text-sm cursor-pointer`}
            >
              End Session
            </button>
          )}
          
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center cursor-pointer"
              >
                <User size={20} className="text-slate-900" />
              </button>
              
              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-slate-800 rounded-md shadow-lg z-10 w-48">
                  <div className="p-3 text-white text-sm border-b border-slate-700">
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-slate-400 text-xs mt-1">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full p-3 text-white text-sm flex items-center hover:bg-slate-700 cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={navigateToLogin}
              className="bg-purple-300 hover:bg-purple-400 text-black py-2 px-4 rounded-md font-medium cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-purple-300 rounded-full mb-4"></div>
            <div className={`${darkMode ? 'text-white' : 'text-slate-900'} text-2xl font-medium mb-2 h-10 flex items-center`}>
              <span>{titleText}</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ml-0.5`}>|</span>
            </div>
          </div>
          
          <div className="max-w-2xl w-full text-center mb-10">
            <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-8`}>
              Dia is your compassionate AI companion, designed to provide a safe space for reflection and emotional support. 
              While not a replacement for professional therapy, Dia offers a judgment-free environment to explore your thoughts and feelings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-12">
              {preWrittenTopics.map((topic, index) => (
                <button
                  key={index}
                  className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-100 border-slate-300'} text-left p-4 rounded-lg border cursor-pointer`}
                  onClick={() => startNewSession(topic.prompt)}
                >
                  <div className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>{topic.title}</div>
                  <div className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>{topic.subtitle}</div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => startNewSession()}
              className="bg-purple-300 hover:bg-purple-400 text-black py-3 px-8 rounded-md font-medium text-lg mx-auto cursor-pointer"
            >
              begin session
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 flex-1 overflow-auto flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-300 rounded-full mr-2"></div>
                <div className={`${darkMode ? 'text-white' : 'text-slate-900'} font-medium`}>Dia</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <div className={`flex items-center mb-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <>
                        <div className="w-6 h-6 bg-purple-300 rounded-full mr-2 flex-shrink-0"></div>
                        <div className={`${darkMode ? 'text-white' : 'text-slate-900'} text-sm`}>Dia</div>
                      </>
                    )}
                    {message.role === 'user' && (
                      <>
                        <div className={`${darkMode ? 'text-white' : 'text-slate-900'} text-sm`}>{getUserDisplayName()}</div>
                        <div className="w-6 h-6 bg-purple-500 rounded-full ml-2 flex-shrink-0 flex items-center justify-center text-white text-xs">
                          👤
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`p-3 rounded-2xl max-w-xs sm:max-w-md md:max-w-lg ${
                        message.role === 'user' 
                          ? `${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-300 text-slate-900'} rounded-tr-none` 
                          : 'bg-purple-300 text-black rounded-tl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div>
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 bg-purple-300 rounded-full mr-2 flex-shrink-0"></div>
                    <div className="text-white text-sm">Dia</div>
                  </div>
                  <div className="flex">
                    <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none max-w-xs sm:max-w-md md:max-w-lg text-white">
                      <p>Dia is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="p-4 flex justify-center">
          <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className={`flex-1 p-3 rounded-md ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border focus:outline-none focus:ring-2 focus:ring-purple-300`}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-purple-300 hover:bg-purple-400 text-black py-2 px-4 rounded-md font-medium cursor-pointer"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}