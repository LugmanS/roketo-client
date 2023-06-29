const TableSkeleton = () => {
    return (
        <table className="w-full animate-pulse">
            <tbody>
                {Array.from({ length: 5 }).map(() => <tr className="border-b border-neutral-800 border-opacity-60 flex items-center gap-10" key={Math.random()}>
                    <td className="py-4 w-1/12"><div className="h-10 bg-neutral-800 rounded opacity-60"></div></td>
                    <td className="w-4/12"><div className="h-6 bg-neutral-800 rounded opacity-60"></div></td>
                    <td className="w-5/12"><div className="h-6 bg-neutral-800 rounded opacity-60"></div></td>
                    <td className="w-2/12"><div className="h-8 bg-neutral-800 rounded opacity-60"></div></td>
                </tr>)}
            </tbody>
        </table>
    );
};
export default TableSkeleton;