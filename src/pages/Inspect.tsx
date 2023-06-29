import { useEffect, useState } from "react";
import { FiGlobe, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { socket } from "../utils/Config";
import { v4 as uuidv4 } from "uuid";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";

const Inspect = () => {

    const { collectionSlug } = useParams();
    const navigate = useNavigate();

    interface Request {
        id: string;
        url: string;
        path: string;
        method: string;
        headers: object;
        body: string;
        status: number;
        query: object;
        cookies: object;
    }

    enum RequestOption {
        HEADERS = 'headers',
        BODY = 'body',
        QUERY = 'query'
    }

    const requestOptions = [
        {
            label: 'Headers',
            value: RequestOption.HEADERS
        },
        {
            label: 'Query',
            value: RequestOption.QUERY
        },
        {
            label: 'Body',
            value: RequestOption.BODY
        }
    ];

    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [currentRequestOption, setCurrentRequestOption] = useState<RequestOption>(requestOptions[0].value);

    const onConnect = () => {
        socket.emit('join', { collectionSlug });
    };

    const moveToConfigure = () => navigate(`/collections/${collectionSlug}`);

    useEffect(() => {
        socket.connect();
        socket.on('connect', onConnect);
        socket.on('new-request', (data) => {
            const request = { ...data, id: uuidv4() };
            setRequests((prev) => [request, ...prev]);
            !selectedRequest && setSelectedRequest(request);
        });
        return () => {
            socket.off('connect', onConnect);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="w-full min-h-screen bg-neutral-900">
            <Navbar />
            <div className="w-full h-full max-w-5xl mx-auto">
                <section className="w-full bg-opacity-50 rounded pt-20 pb-4 flex items-start justify-between">
                    <div>
                        <h1 className="text-lg text-white" >🕵️ Inspect requests</h1>
                        <div className="my-2">
                            <div className="flex items-center gap-2">
                                <FiGlobe className="text-white w-5 h-5" />
                                <h1 className="text-white text-xl">{collectionSlug}.roketo.cloud</h1>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">All requests to this endpoint will be displayed here.</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-400 text-gray-400 hover:border-white hover:text-white transition duration-150 text-sm rounded" onClick={moveToConfigure}>Configure endpoints</button>
                </section>
                {
                    requests.length > 0 ? <section className="flex items-start justify-between h-[540px] overflow-hidden">
                        <div className="min-w-[18rem] border-r border-neutral-800 pr-2 flex flex-col items-start gap-2">
                            <h1 className="font-medium text-lg text-gray-400">Requests</h1>
                            <div className="w-full max-h-[540px] overflow-y-auto pr-2 flex flex-col items-start gap-2">
                                {requests.map((request, index) => <div key={index} className={`w-full rounded p-3 flex items-center gap-2 border bg-neutral-800 bg-opacity-50 hover:bg-opacity-40 ${selectedRequest?.id !== request.id ? "cursor-pointer border-neutral-800" : "border-white"}`} onClick={() => selectedRequest?.id !== request.id && setSelectedRequest(request)}>
                                    <div className="px-2 py-1 bg-neutral-700 text-white rounded text-xs">{request.method}</div>
                                    <div className="text-white text-sm truncate">{request.path}</div>
                                </div>)}
                            </div>
                        </div>
                        {selectedRequest && <div className="text-white w-full flex flex-col px-4">
                            <h1 className="font-medium text-lg text-gray-400">Request details</h1>
                            <div className="flex items-center gap-3 my-2">
                                <div className="rounded px-2 py-1 bg-white text-black">{selectedRequest.method}</div>
                                <p className="bg-white bg-opacity-10 px-2 py-1 rounded">{selectedRequest.url}</p>
                            </div>
                            <div className="flex flex-col items-start gap-1 w-full h-72">
                                <div className="flex items-center gap-2 text-gray-400 text-sm my-2">
                                    {requestOptions.map((requestOption) => !(requestOption.value === 'body' && selectedRequest.method === 'GET') && <button key={requestOption.value} className={`px-2 py-1 rounded duration-150 transition-colors ${requestOption.value === currentRequestOption ? "bg-white text-black" : "hover:bg-neutral-700 hover:text-white"}`} onClick={() => requestOption.value !== currentRequestOption && setCurrentRequestOption(requestOption.value)}>{requestOption.label}</button>)}
                                </div>
                                <AceEditor
                                    style={{
                                        width: "100%"
                                    }}
                                    wrapEnabled={true}
                                    value={JSON.stringify(selectedRequest[currentRequestOption], null, '\t')}
                                    mode="json"
                                    theme="twilight"
                                    name="UNIQUE_ID_OF_DIV"
                                    editorProps={{ $blockScrolling: true }}
                                />
                            </div>
                        </div>}
                    </section> : <section className="w-full h-[540px] min-h-max flex items-center justify-center">
                        <div className="text-gray-400 flex flex-col items-center gap-4">
                            <FiRefreshCw className="w-8 h-8 animate-spin" />
                            <h1 className="text-white text-lg">Waiting for request</h1>
                        </div>
                    </section>
                }
            </div>
        </div>
    );
};
export default Inspect;