import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import styled from '@emotion/styled';

// Styled components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #ffffff;
  color: #000000;
`;

const Sidebar = styled.div`
  width: 20%;
  background-color: #f7f7f7;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const ChatContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f0f4f8;
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #ffffff;
`;

const ChatInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #ccc;
  display: flex;
  background-color: #f7f7f7;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const MessageBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
`;

const HomePage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`*, users(username)`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((currentMessages) => [...currentMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userId = supabase.auth.user().id;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ content: message, sender_id: userId, group_id: 1 }]);

    if (error) {
      setError(error.message);
    } else {
      setMessage('');
    }
  };

  const handleCreateGroup = async () => {
    const groupName = prompt('Enter group name');
    if (!groupName) return;

    const { data, error } = await supabase
      .from('groups')
      .insert([{ name: groupName }]);

    if (error) {
      console.error(error);
    } else {
      console.log('Group created:', data);
    }
  };

  const handleAddMember = async () => {
    const username = prompt('Enter username to add');
    const role = prompt('Enter role for the user');
    if (!username || !role) return;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .single();

    if (userError) {
      console.error(userError);
    } else {
      const { data, error } = await supabase
        .from('group_members')
        .insert([{ user_id: user.id, group_id: 1, role }]);

      if (error) {
        console.error(error);
      } else {
        console.log('Member added:', data);
      }
    }
  };

  return (
    <Container>
      <Sidebar>
        <h2>Channels</h2>
        <Button onClick={handleCreateGroup}>Create Group</Button>
        <Button onClick={handleAddMember}>Add Member</Button>
      </Sidebar>
      <ChatContainer>
        <ChatHeader>Chat Room</ChatHeader>
        <ChatMessages>
          {messages.map((msg) => (
            <MessageBox key={msg.id}>
              <p><strong>{msg.users.username}</strong> - {new Date(msg.created_at).toLocaleTimeString()}</p>
              <p>{msg.content}</p>
            </MessageBox>
          ))}
        </ChatMessages>
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </ChatInputContainer>
      </ChatContainer>
    </Container>
  );
};

export default HomePage;
