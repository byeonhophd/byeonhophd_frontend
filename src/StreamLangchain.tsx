import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import './StreamLangchain.css';

interface Response {
    sender: string;
    message: string;
    chunks?: string[];
}

const StreamLangchain: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [responses, setResponses] = useState<Response[]>([]);
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
    const maxReconnectAttempts = 5;

    const setupWebSocket = () => {
        ws.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

        ws.current.onopen = () => {
            console.log("WebSocket connected!");
            setReconnectAttempts(0);
        };

        ws.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data); // 추가된 로그
        
            if (data.event === 'on_parser_stream') {
                setResponses(prevResponses => {
                    const lastMessage = prevResponses[prevResponses.length - 1];
                    if (lastMessage && lastMessage.sender === 'Assistant') {
                        const updatedMessage = { 
                            ...lastMessage, 
                            message: lastMessage.message + data.output 
                        };
                        return [...prevResponses.slice(0, -1), updatedMessage];
                    } else {
                        return [...prevResponses, { sender: 'Assistant', message: data.output }];
                    }
                });
            } else if (data.event === 'error') {
                setResponses(prevResponses => [...prevResponses, { sender: 'System', message: data.message }]);
            } else if (data.event === 'conversation_id') {
                console.log("Received conversation ID:", data.conversation_id);
                // 필요한 경우 conversation_id를 저장할 수 있습니다.
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
                response.sender === 'Assistant' && response.chunks 
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
        if (input.trim() === "") return; // 빈 입력 방지
        const userMessage = { sender: "You", message: input };
        setResponses(prevResponses => [...prevResponses, userMessage]);
        ws.current?.send(JSON.stringify({ message: input }));
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
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default StreamLangchain;