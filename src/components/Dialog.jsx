import { useEffect, useState } from 'react';
import InputMessage from './InputMessage';

export default function Dialog({ id, messages = [], onDelete, onReset, onSend }) {
  const [localMessages, setLocalMessages] = useState(Array.isArray(messages) ? messages : []);

  useEffect(() => {
    console.log('Fetching messages for conversation ID:', id);
    setLocalMessages(Array.isArray(messages) ? messages : []);
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
    console.log('Sending message:', message); 
    const url = `http://localhost:5001/conversations/${id}?_embed=messages`;
    console.log('POST URL:', url);

    if (!id) {
      console.error('ID is undefined while sending message');
      alert('Cannot send message, ID is undefined');
      return;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const conversation = await response.json();
        console.log('Fetched conversation:', conversation); 

        if (!Array.isArray(conversation.messages)) {
          conversation.messages = [];
        }

        const updatedMessages = [...conversation.messages, { content: message, role: 'user' }];
        const updatedConversation = { ...conversation, messages: updatedMessages };

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

          setTimeout(async () => {
            const fakeResponseContent = await fetchRandomMessage();
            const fakeResponse = { content: fakeResponseContent, role: 'assistant' };
            const updatedMessagesWithFakeResponse = [...updatedMessages, fakeResponse];
            const updatedConversationWithFakeResponse = { ...updatedConversation, messages: updatedMessagesWithFakeResponse };

            const putFakeResponse = await fetch(`http://localhost:5001/conversations/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedConversationWithFakeResponse)
            });

            if (putFakeResponse.ok) {
              setLocalMessages(updatedMessagesWithFakeResponse);
              onSend(fakeResponse.content);
            } else {
              console.error('Failed to update conversation with fake response:', putFakeResponse.status);
            }
          }, 1000); 
        } else {
          console.error('Failed to update conversation:', putResponse.status);
          alert('Failed to send message');
        }
      } else {
        console.error('Failed to fetch conversation:', response.status);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessagePair = (index) => {
    setLocalMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 2); 
      return updatedMessages;
    });
    onDelete(index);
  };

  const handleResetMessages = () => {
    setLocalMessages([]);
    onReset();
  };

  return (
    <div className="conversation">
      <h2>Conversation {id}</h2>
      <div className="messages">
        {localMessages.map((message, index) => (
          index % 2 === 0 && index + 1 < localMessages.length ? (
            <div key={index} className="message-pair">
              <div className={`message ${localMessages[index].role}`}>
                {localMessages[index].content}
              </div>
              <div className={`message ${localMessages[index + 1].role}`}>
                {localMessages[index + 1].content}
              </div>
              <button onClick={() => handleDeleteMessagePair(index)}>Delete</button>
            </div>
          ) : null
        ))}
      </div>
      <button onClick={handleResetMessages}>Reset Dialog</button>
      <InputMessage onSend={handleSendMessage} />
    </div>
  );
}

