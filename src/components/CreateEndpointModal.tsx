import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";
import { EndpointModalConfig, ModalType } from '../utils/Types';
import { baseURL } from '../utils/Config';
import axios from 'axios';

export default function EndpointConfigModal({ isOpen, modalConfig, collectionSlug }: { isOpen: boolean; modalConfig: EndpointModalConfig; collectionSlug: string; }) {
    const methodOptions = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'];
    const [config, setConfig] = useState<EndpointModalConfig>(modalConfig);
    const [isLoading, setLoading] = useState(false);
    const [isSaveEnabled, setSaveEnabled] = useState(false);

    const [headers, setHeaders] = useState(JSON.stringify(config.values.headers, null, '\t'));
    const [headerError, setHeaderError] = useState(false);

    const createEndpoint = async () => {
        setLoading(true);
        try {
            await axios.post(`${baseURL}/collection/${collectionSlug}/endpoint`, { ...config.values }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            config.onClose(true);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const updateEndpoint = async () => {
        setLoading(true);
        const endpointId = btoa(`${collectionSlug}-${modalConfig.values.method}-${modalConfig.values.path}`);
        try {
            await axios.put(`${baseURL}/collection/${collectionSlug}/endpoint/${endpointId}`, { ...config.values }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            config.onClose(true);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const onSubmit = () => {
        config.type === ModalType.CREATE ? createEndpoint() : updateEndpoint();
    };

    const onHeaderChange = (value: string) => {
        setHeaders(value);
        try {
            const parsed = JSON.parse(value);
            onChange('headers', parsed);
            setHeaderError(false);
        } catch (error) {
            setHeaderError(true);
        }
    };

    const onChange = (key: string, value: string) => {
        setConfig((prev) => ({
            ...prev,
            values: { ...prev.values, [key]: value }
        }));
        setSaveEnabled(true);
    };
    useEffect(() => setConfig(modalConfig), [isOpen, modalConfig]);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => config.onClose(false)} >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        {config.type === 'create' ? "Add new endpoint" : "Edit endpoint configuration"}
                                    </Dialog.Title>
                                    <div className='flex flex-col items-center justify-between w-full gap-4 mt-2'>
                                        <div className='flex flex-col items-start gap-1 w-full'>
                                            <label className='text-gray-500 text-sm'>Path</label>
                                            <input type="text" name="path" autoComplete='off' value={config.values.path} className='w-full px-3 py-1.5 text-sm bg-transparent text-white rounded border border-gray-500 focus:border-gray-200 focus:outline-none' placeholder='/users' onChange={(e) => onChange('path', e.target.value)} />
                                        </div>
                                        <div className='flex items-center justify-between w-full gap-2'>
                                            <div className='flex flex-col items-start gap-1 w-full'>
                                                <label className='text-gray-500 text-sm'>Method</label>
                                                <select className='w-full px-3 py-1.5 text-sm bg-transparent text-white rounded border border-gray-500 focus:outline-none focus:border-gray-200' value={config.values.method} name="method" onChange={(e) => onChange('method', e.target.value)}>
                                                    {methodOptions.map((method, index) => <option key={index} className="">{method}</option>)}
                                                </select>
                                            </div>
                                            <div className='flex flex-col items-start gap-1 w-full'>
                                                <label className='text-gray-500 text-sm'>Response Status</label>
                                                <input type="number" min='200' max="599" name='statusCode' value={config.values.statusCode} className='w-full px-3 py-1.5 text-sm bg-transparent text-white rounded border border-gray-500 focus:outline-none focus:border-gray-200' onChange={(e) => onChange('statusCode', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-start gap-1 w-full h-36'>
                                            <div className='flex justify-between items-center w-full'>
                                                <label className='text-gray-500 text-sm'>Response Headers</label>
                                                {headerError && <p className='text-red-400 text-xs'>Headers should be of type JSON</p>}
                                            </div>
                                            <AceEditor
                                                style={{
                                                    width: "100%"
                                                }}
                                                value={headers}
                                                onChange={onHeaderChange}
                                                mode="json"
                                                theme="twilight"
                                                name="UNIQUE_ID_OF_DIV"
                                                editorProps={{ $blockScrolling: true }}
                                            />
                                        </div>
                                        <div className='flex flex-col items-start gap-1 w-full h-36'>
                                            <label className='text-gray-500 text-sm'>Response Body</label>
                                            <AceEditor
                                                style={{
                                                    width: "100%"
                                                }}
                                                onChange={(value) => onChange('body', value)}
                                                value={config.values.body}
                                                mode="text"
                                                theme="twilight"
                                                name="UNIQUE_ID_OF_DIV"
                                                editorProps={{ $blockScrolling: true }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="border border-gray-400 text-gray-400 px-4 py-2 rounded text-sm hover:border-white hover:text-white transition-colors duration-150"
                                            onClick={() => config.onClose(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-white px-4 py-2 rounded text-sm disabled:opacity-40"
                                            onClick={onSubmit}
                                            disabled={!isSaveEnabled && !isLoading}
                                        >
                                            {isLoading ? "Saving" : "Save"}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}