// StreamLangchain.tsx
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import './StreamLangchain.css';

interface Response {
    sender: string;
    message: string;
    chunks?: string[];
}

interface MessageState {
    chatContent?: string;
}

const StreamLangchain: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [responses, setResponses] = useState<Response[]>([]);
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
    const maxReconnectAttempts = 5;
    const initialMessageSent = useRef<boolean>(false); // 초기 메시지 전송 여부를 추적하는 플래그
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);

    const location = useLocation();
    const state = location.state as MessageState;
    console.log("Location state:", state);

    useEffect(() => {
        console.log("Responses updated:", responses);
    }, [responses]);

    const setupWebSocket = () => {
        ws.current = new WebSocket('ws://www.example.com/ws/chat/');

        ws.current.onopen = () => {
            console.log("WebSocket connected!");
            setReconnectAttempts(0);
            if (state && state.chatContent && !initialMessageSent.current) {
                // 내용이 있으면 input-form에 내용 넣기
                setInput(state.chatContent);
                // 잠깐 대기
                setTimeout(() => {
                    submitButtonRef.current?.click();
                }, 500);
            }
        };

        ws.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data); // 추가된 로그
        
            if (data.event === 'on_parser_stream') {
                setResponses(prevResponses => {
                    const lastMessage = prevResponses[prevResponses.length - 1];
                    if (lastMessage && lastMessage.sender === 'LawGenda') {
                        const updatedMessage = { 
                            ...lastMessage, 
                            message: lastMessage.message + data.output 
                        };
                        return [...prevResponses.slice(0, -1), updatedMessage];
                    } else {
                        return [...prevResponses, { sender: 'LawGenda', message: data.output }];
                    }
                });
            } else if (data.event === 'error') {
                setResponses(prevResponses => [...prevResponses, { sender: 'LawGenda', message: "에러가 발생하였습니다. 다시 시도해주세요." }]);
            } else if (data.event === 'conversation_id') {
                console.log("Received conversation ID:", data.conversation_id);
            }
        };

        ws.current.onerror = (event) => {
            console.error("WebSocket error observed:", event);
        };

        ws.current.onclose = (event) => {
            console.log(`WebSocket is closed now. Code: ${event.code}, Reason: ${event.reason}`);
            handleReconnect();
        };
    };

    const handleReconnect = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
            let timeout = Math.pow(2, reconnectAttempts) * 1000;
            setTimeout(() => {
                setupWebSocket();
                setReconnectAttempts(prev => prev + 1);
            }, timeout);
        } else {
            console.log("Max reconnect attempts reached, not attempting further reconnects.");
        }
    };

    useEffect(() => {
        setupWebSocket();

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [responses]);

    const renderMessage = (response: Response, index: number) => (
        <div key={index} className={`message ${response.sender}`}>
            <strong>{response.sender}</strong> {
                response.sender === 'LawGenda' && response.chunks 
                    ? response.chunks.join(' ') 
                    : <span style={{ whiteSpace: 'pre-wrap'}}>{response.message}</span>
            }
        </div>
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(input);
    };

    const sendMessage = (message: string) => {
        if (message.trim() === "") return; // 빈 입력 방지
        const userMessage = { sender: "김시민", message: message };
        setResponses(prevResponses => [...prevResponses, userMessage]);
        ws.current?.send(JSON.stringify({ message: message }));
        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {responses.map((response, index) => renderMessage(response, index))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="여기에 궁금한 점을 입력해주세요."
                />
                <button ref={submitButtonRef} type="submit">전송</button>
            </form>
        </div>
    );
};

export default StreamLangchain;