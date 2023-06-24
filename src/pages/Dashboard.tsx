import { FiEdit, FiGithub, FiGlobe, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import EndpointConfigModal from "../components/CreateEndpointModal";
import Spinner from "../components/Spinner";
import axios from "axios";
import { baseURL } from "../utils/Config";
import { Endpoint, EndpointModalConfig, Method, ModalType } from "../utils/Types";
import TableSkeleton from "../components/TableSkeleton";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const { collectionSlug } = useParams();
    const initialEndpointConfig = {
        path: '',
        method: Method.GET,
        headers: { 'Content-Type': 'application/json' },
        body: "",
        statusCode: 200
    };

    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [configModalOpen, setConfigModalOpen] = useState(false);

    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
    const [isEndpointsLoading, setEndpointsLoading] = useState(false);
    const getCollectionEndpoints = async () => {
        setEndpointsLoading(true);
        try {
            let response = await (await axios.get(`${baseURL}/collection/${collectionSlug}`)).data;
            response = response.map((endpoint: string) => JSON.parse(endpoint));
            setEndpoints(response);
            setEndpointsLoading(false);
        } catch (error) {
            setEndpointsLoading(false);
            console.log('Error', error);
        }
    };

    const deleteEndpoint = async (endpointConfig: Endpoint, index: number) => {
        setDeletingIndex(index);
        const endpointId = btoa(`${collectionSlug}-${endpointConfig.method}-${endpointConfig.path}`);
        try {
            await axios.delete(`${baseURL}/collection/${collectionSlug}/endpoint/${endpointId}`);
            setDeletingIndex(null);
            getCollectionEndpoints();
        } catch (error) {
            setDeletingIndex(null);
            console.log(error);
        }
    };

    const closeEndpointConfigModal = (isChanged: boolean) => {
        setConfigModalOpen(false);
        isChanged && getCollectionEndpoints();
    };

    const initialModalConfig = {
        type: ModalType.CREATE,
        onClose: closeEndpointConfigModal,
        values: initialEndpointConfig
    };

    const [endpointModalConfig, setEndpointModalConfig] = useState<EndpointModalConfig>(initialModalConfig);

    const openEndpointConfigModal = (type: ModalType, endpointConfig: Endpoint | null) => {
        const modalConfig = {
            type,
            onClose: closeEndpointConfigModal,
            values: type === ModalType.CREATE || !endpointConfig ? initialEndpointConfig : endpointConfig
        };
        setEndpointModalConfig({ ...modalConfig });
        setConfigModalOpen(true);
    };


    useEffect(() => {
        getCollectionEndpoints();
    }, []);

    return (
        <div className="bg-neutral-900 w-full min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto">
                <section className="w-full bg-opacity-50 rounded pt-20 pb-4">
                    <h1 className="text-xl text-white" >👋 Welcome back,</h1>
                    <div className="my-2">
                        <div className="flex items-center gap-2">
                            <FiGlobe className="text-white w-6 h-6" />
                            <h1 className="text-white text-2xl">{collectionSlug}.roketo.com</h1>
                        </div>
                    </div>
                </section>
                <div className="flex items-center justify-between mt-2">
                    <h1 className="text-gray-300 text-lg font-medium">API endpoints</h1>
                    <div>
                        <button className="px-4 py-2 bg-white text-sm flex items-center gap-1 rounded" onClick={() => openEndpointConfigModal(ModalType.CREATE, null)}>
                            <FiPlus className="w-4 h-4" />
                            Add endpoint
                        </button>
                    </div>
                </div>
                <div className="my-4">
                    {
                        isEndpointsLoading ? <TableSkeleton /> : <table className="w-full">
                            <thead>
                                <tr className="text-gray-400 font-normal">
                                    <th className="font-normal text-start w-2">Method</th>
                                    <th className="font-normal text-start w-48">Path</th>
                                    <th className="font-normal text-start w-48">Description</th>
                                    <th className="font-normal text-start w-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {endpoints.map((endpoint, index) =>
                                    <tr className="border-b border-neutral-800" key={index}>
                                        <td className="py-4">
                                            <div className="px-4 py-2 max-w-min bg-neutral-700 bg-opacity-30 text-white text-sm rounded">
                                                {endpoint.method}
                                            </div>
                                        </td>
                                        <td className="text-white">{endpoint.path}</td>
                                        <td className="text-white text-sm">{endpoint.method} request with response status {endpoint.statusCode}</td>
                                        <td>
                                            <button className="text-gray-400 hover:bg-gray-500 hover:bg-opacity-20 p-2 rounded-md mr-3 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400" onClick={() => openEndpointConfigModal(ModalType.UPDATE, endpoint)} disabled={!(!deletingIndex)}>
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            {(deletingIndex !== index) ? <button className="text-gray-400 hover:bg-red-800 hover:bg-opacity-20 hover:text-red-400 p-2 rounded-md disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400" onClick={() => deleteEndpoint(endpoint, index)} disabled={!(!deletingIndex)}>
                                                <FiTrash2 className="w-5 h-5" />
                                            </button> : <button className="p-3" disabled ><Spinner className="text-red-400 h-5 w-5" /></button>}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    }
                </div>
                <EndpointConfigModal isOpen={configModalOpen} modalConfig={endpointModalConfig} collectionSlug={collectionSlug} />
                <div className="h-40"></div>
            </div>
        </div>
    );
};
export default Dashboard;