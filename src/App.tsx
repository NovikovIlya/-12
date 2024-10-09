import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { MessageSquare, Upload, Send } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  console.log('123')
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          try {
            const result = await mammoth.extractRawText({ arrayBuffer });
            const text = result.value;
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: `Uploaded file content: ${text}`, sender: 'user' },
            ]);
          } catch (error) {
            console.error('Error parsing .docx file:', error);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: 'user' },
      ]);
      setInputMessage('');
      // Here you would typically send the message to a backend and get a response
      // For now, we'll just simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Thanks for your message! This is a cartoon-themed chat.', sender: 'bot' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      <header className="bg-yellow-400 p-4 text-center">
        <h1 className="text-3xl font-bold text-blue-800">Cartoon Chat</h1>
      </header>
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-green-300 text-green-900'
                  : 'bg-white text-blue-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4 cursor-pointer hover:bg-gray-50"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the .docx file here ...</p>
          ) : (
            <p>Drag 'n' drop a .docx file here, or click to select one</p>
          )}
          <Upload className="mx-auto mt-2" />
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;