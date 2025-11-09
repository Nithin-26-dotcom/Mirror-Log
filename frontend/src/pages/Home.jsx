import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent } from "../components/ui/card";

import * as pageService from "../services/pageService.js";
import * as roadmapService from "../services/roadmapService.js";
import * as tagService from "../services/tagService.js";
import * as logService from "../services/logService.js";

export default function Home() {
    // States
    const [pages, setPages] = useState([]);
    const [newPage, setNewPage] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [tags, setTags] = useState([]);
    const [logs, setLogs] = useState([]);

    // Fetch initial data
    useEffect(() => {
        fetchPages();
        fetchTags();
        fetchLogs();
    }, []);

    // ---------------- FETCHERS ----------------
    const fetchPages = async () => {
        const res = await pageService.getPages();
        setPages(res.data || []);
    };

    const fetchRoadmap = async (pageId) => {
        const res = await roadmapService.getRoadmapByPage(pageId);
        setRoadmap(res.data);
    };

    const fetchTags = async () => {
        const res = await tagService.getTags();
        setTags(res.data || []);
    };

    const fetchLogs = async () => {
        const res = await logService.getLogs();
        setLogs(res.data || []);
    };

    // ---------------- CRUD ----------------
    const addPage = async () => {
        if (!newPage) return;
        await pageService.createPage({ title: newPage });
        setNewPage("");
        fetchPages();
    };

    const deletePage = async (id) => {
        await pageService.deletePage(id);
        fetchPages();
    };

    // ---------------- UI ----------------
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-60 bg-white shadow-md p-4">
                <h1 className="text-xl font-bold mb-4">MirrorLog</h1>
                <ul className="space-y-2">
                    <li className="cursor-pointer hover:text-blue-600">Home</li>
                    <li className="cursor-pointer hover:text-blue-600">Pages</li>
                    <li className="cursor-pointer hover:text-blue-600">Roadmap</li>
                    <li className="cursor-pointer hover:text-blue-600">Tags</li>
                    <li className="cursor-pointer hover:text-blue-600">Logs</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 space-y-8">
                {/* Pages Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Pages</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2 mb-4">
                            <Input
                                placeholder="New page title"
                                value={newPage}
                                onChange={(e) => setNewPage(e.target.value)}
                            />
                            <Button onClick={addPage}>Add</Button>
                        </div>
                        <ul className="space-y-2">
                            {pages.map((p) => (
                                <li
                                    key={p._id}
                                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                                >
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => fetchRoadmap(p._id)}
                                    >
                                        {p.title}
                                    </span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deletePage(p._id)}
                                    >
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Roadmap Section */}
                {roadmap && (
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Roadmap</h2>
                        </CardHeader>
                        <CardContent>
                            {roadmap.subheadings.map((sh, idx) => (
                                <div key={idx} className="mb-4">
                                    <h3 className="font-bold">{sh.title}</h3>
                                    <ul className="list-disc ml-6">
                                        {sh.todos.map((todo) => (
                                            <li key={todo._id}>{todo.content}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Tags Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Tags</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((t) => (
                                <span
                                    key={t._id}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Logs Section */}
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Logs</h2>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {logs.map((l) => (
                                <li key={l._id} className="p-2 bg-gray-100 rounded">
                                    {l.content}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
