import { ClientFilters } from "@/types/client";

const RenderWaitTimeFilters = ({
  statusFilter,
  handleUpdateFilters,
}: {
  statusFilter: ClientFilters;
  handleUpdateFilters: (min?: number, max?: number) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div>
        <label
          htmlFor="minWaitTime"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Wait Time (seconds)
        </label>
        <input
          type="number"
          id="minWaitTime"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={statusFilter?.minWaitTime || 0}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : undefined;
            handleUpdateFilters(value, statusFilter?.maxWaitTime);
          }}
          min="0"
        />
      </div>

      <div>
        <label
          htmlFor="maxWaitTime"
          className="block text-sm font-medium text-gray-700"
        >
          Maximum Wait Time (seconds)
        </label>
        <input
          type="number"
          id="maxWaitTime"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={statusFilter?.maxWaitTime || 0}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : undefined;
            handleUpdateFilters(statusFilter?.minWaitTime, value);
          }}
          min="0"
        />
      </div>

      <div className="self-end">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => handleUpdateFilters(undefined, undefined)}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
export default RenderWaitTimeFilters;
