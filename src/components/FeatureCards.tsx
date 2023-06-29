import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiCopy, FiLifeBuoy } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CopyTextBox = ({ content }: { content: string; }) => {

    const [isCopied, setCopied] = useState(false);
    const onCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (<div className="my-2 border border-neutral-800 text-white py-2 pl-4 pr-9 text-sm rounded w-full bg-neutral-950 relative">
        <p className="max-w-full overflow-x-scroll no-scrollbar">{content}</p>
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-white rounded duration-150 transition" onClick={onCopy} disabled={isCopied}>
            {isCopied ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
        </button>
    </div>);
};

const FeatureCards = ({ collectionSlug, page }: { collectionSlug: string; page: string; }) => {

    const navigate = useNavigate();

    return (
        <section className="w-full h-92 flex items-center gap-4 justify-between my-10">
            <div className="w-6/12 h-[240px] rounded border border-neutral-800 p-6">
                <h1 className="text-lg text-white font-medium">All set! Try your endpoint</h1>
                <p className="text-gray-500 text-sm my-1">The endpoint is fully configured and ready to use. Simply copy the below URL and use it as the base URL in your code.</p>
                <CopyTextBox content={`https://${collectionSlug}.roketo.cloud`} />
                <p className="text-sm text-gray-500">Try out your endpoint in shell or terminal</p>
                <CopyTextBox content={`curl --location 'https://${collectionSlug}.roketo.cloud'`} />
            </div>
            <div className="w-3/12 h-[240px] rounded border border-neutral-800 p-6 bg-gradient-to-br from-transparent to-neutral-900 flex flex-col items-center justify-center gap-2 relative">
                <FiLifeBuoy className="text-white h-8 w-8" />
                <h1 className="text-white text-lg font-medium">Mock failures</h1>
                <p className="text-gray-500 text-sm text-center">Edit endpoint rules to mock failure cases</p>
                {page === 'inspect' && <button className="absolute bottom-2 right-2 bg-neutral-800 p-2 rounded hover:bg-neutral-700 duration-150 transition" onClick={() => navigate(`/collections/${collectionSlug}`)}><FiArrowRight className="text-white" /></button>}
            </div>
            <div className="w-3/12 h-[240px] rounded border border-neutral-800 p-6 bg-gradient-to-br from-transparent to-neutral-900 flex flex-col items-center justify-center gap-2 relative">
                <RiRouteLine className="text-white h-8 w-8" />
                <h1 className="text-white text-lg font-medium">Inspect Requests</h1>
                <p className="text-gray-500 text-sm text-center">Monitor requests in real time</p>
                {page === 'dashboard' && <button className="absolute bottom-2 right-2 bg-neutral-800 p-2 rounded hover:bg-neutral-700 duration-150 transition" onClick={() => navigate(`/collections/${collectionSlug}/inspect`)}><FiArrowRight className="text-white" /></button>}
            </div>
        </section>
    );
};
export default FeatureCards;