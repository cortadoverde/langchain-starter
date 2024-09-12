"use client";

import { useState, useEffect,  useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

import { Dashboard } from './dashboard';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import dynamic from "next/dynamic";

export function Api() {

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'Shopify' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: 'Zohoo' } },
        { id: '3', position: { x: 0, y: 200 }, data: { label: 'Amazon' } },
        { id: '4', position: { x: 0, y: 300 }, data: { label: 'Ebay' } },
        { id: '5', position: { x: 0, y: 400 }, data: { label: 'Google' } },
        { id: '6', position: { x: 0, y: 500 }, data: { label: 'Facebook' } },
        { id: '7', position: { x: 0, y: 600 }, data: { label: 'LinkedIn' } },
        { id: '8', position: { x: 0, y: 700 }, data: { label: 'Twitter' } },
        { id: '9', position: { x: 0, y: 800 }, data: { label: 'Instagram' } },
        { id: '10', position: { x: 0, y: 900 }, data: { label: 'Snapchat' } },
        { id: '11', position: { x: 0, y: 1000 }, data: { label: 'Tiktok' } },
        { id: '12', position: { x: 0, y: 1100 }, data: { label: 'Youtube' } },
        { id: '13', position: { x: 0, y: 1200 }, data: { label: 'Mercadolibre' }}
      ];
      const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
    const edgeReconnectSuccessful = useRef(true);
    const [ReactJson, setReactJson] = useState();
    const [responseData, setResponseData] = useState({})

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
      }, []);
    
      const onReconnect = useCallback((oldEdge, newConnection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
      }, []);
    
      const onReconnectEnd = useCallback((_, edge) => {
        if (!edgeReconnectSuccessful.current) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    
        edgeReconnectSuccessful.current = true;
      }, []);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            setReactJson(dynamic(import("@/components/component/json"), { ssr: false }));
        }
    }, [responseData])

    async function submitHandler(e)
    {
        e.preventDefault();
        const name = e.target.endpoint.value;
        const res = await fetch(name);

        setResponseData(await res.json());
    }
    return (
        <>
        <Dashboard /> 
        <div className="grid  grid-cols-4 gap-4">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>API</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitHandler}>
                            <label htmlFor="name">Name</label>
                            <input type="text" placeholder="Name"  name="endpoint" />

                            <button type="submit">
                                Resolve
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>API</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: '100%', height: '100vh' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            style={{ color: '#333', fontWeight: 'bold' }}
                        >
                            <Controls />
                            <MiniMap />
                            <Background variant="dots" gap={12} size={1} />
                        </ReactFlow>
                        </div>
                    {ReactJson && (
                        <ReactJson
                            src={responseData}
                            onAdd={false}
                            theme="threezerotwofour"
                            onEdit={e => {
                                console.log("edit callback", e)
                                if (e.new_value == "error") {
                                    return false
                                }
                            }}
                            onDelete={e => {
                                console.log("delete callback", e)
                            }}
                            onAdd={e => {
                                console.log("add callback", e)
                                if (e.new_value == "error") {
                                    return false
                                }
                            }}
                            onSelect={e => {
                                console.log("select callback", e)
                                console.log(e.namespace)
                            }}
                        />
                    )}
                    </CardContent>
                </Card>
            </div>
        </div>
        </>

        
    )
}