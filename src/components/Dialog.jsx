import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InputMessage from './InputMessage';

export default function Dialog() {
  const { id } = useParams(); // Получаем id из URL
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('Fetching messages for conversation ID:', id); // Лог ID
    if (!id) {
      console.error('ID is undefined');
      return;
    }

    async function fetchMessages() {
      try {
        const response = await fetch(`http://localhost:5001/conversations/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched messages:', data.messages); // Лог успешного получения сообщений
          setMessages(data.messages);
        } else {
          console.error('Failed to fetch messages:', response.status);
        }
      } catch (error) {
        console.error('Error fetching messages:', error); // Лог ошибок
      }
    }

    fetchMessages();
  }, [id]);

  const handleSendMessage = async (message) => {
    console.log('Sending message:', message); // Лог отправляемого сообщения

    if (!id) {
      console.error('ID is undefined while sending message');
      alert('Cannot send message, ID is undefined');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/conversations/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message, role: 'user' })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sent message response:', data); // Лог успешного ответа
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        console.error('Failed to send message:', response.status);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error); // Лог ошибок
    }
  };

  const handleDeleteMessage = (messageIndex) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== messageIndex));
  };

  const handleResetMessages = () => {
    setMessages([]);
  };

  return (
    <div className="conversation">
      <h2>Conversation {id}</h2>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
            <button onClick={() => handleDeleteMessage(index)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={handleResetMessages}>Reset Dialog</button>
      <InputMessage onSend={handleSendMessage} />
    </div>
  );
}
