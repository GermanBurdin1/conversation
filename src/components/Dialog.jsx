import { useEffect, useState } from 'react';
import InputMessage from './InputMessage';

export default function Dialog({ id, messages, onDelete, onReset, onSend }) {
  const [localMessages, setLocalMessages] = useState(messages);

  useEffect(() => {
    console.log('Fetching messages for conversation ID:', id); // Лог ID
    setLocalMessages(messages);
  }, [id, messages]);

  const fetchRandomMessage = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error fetching random message:', error);
      return 'Error fetching message';
    }
  };

  const handleSendMessage = async (message) => {
    console.log('Sending message:', message); // Лог отправляемого сообщения
    const url = `http://localhost:5001/conversations/${id}?_embed=messages`;
    console.log('POST URL:', url); // Лог URL

    if (!id) {
      console.error('ID is undefined while sending message');
      alert('Cannot send message, ID is undefined');
      return;
    }

    try {
      // Fetch the current conversation
      const response = await fetch(url);
      if (response.ok) {
        const conversation = await response.json();

        // Update the conversation with the new message
        const updatedMessages = [...conversation.messages, { content: message, role: 'user' }];
        const updatedConversation = { ...conversation, messages: updatedMessages };

        // Send the updated conversation back to the server
        const putResponse = await fetch(`http://localhost:5001/conversations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedConversation)
        });

        if (putResponse.ok) {
          console.log('Updated conversation:', updatedConversation);
          setLocalMessages(updatedMessages);
          onSend(message);

          // Генерация фейкового ответа от сервера
          setTimeout(async () => {
            const fakeResponseContent = await fetchRandomMessage();
            const fakeResponse = { content: fakeResponseContent, role: 'assistant' };
            const updatedMessagesWithFakeResponse = [...updatedMessages, fakeResponse];
            const updatedConversationWithFakeResponse = { ...conversation, messages: updatedMessagesWithFakeResponse };

            // Send the updated conversation back to the server
            await fetch(`http://localhost:5001/conversations/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedConversationWithFakeResponse)
            });

            setLocalMessages(updatedMessagesWithFakeResponse);
            onSend(fakeResponse.content);
          }, 1000); // 1 second delay for fake response
        } else {
          console.error('Failed to update conversation:', putResponse.status);
          alert('Failed to send message');
        }
      } else {
        console.error('Failed to fetch conversation:', response.status);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error); // Log errors
    }
  };

  const handleDeleteMessage = (messageIndex) => {
    onDelete(messageIndex);
  };

  const handleResetMessages = () => {
    onReset();
  };

  return (
    <div className="conversation">
      <h2>Conversation {id}</h2>
      <div className="messages">
        {localMessages.map((message, index) => (
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
