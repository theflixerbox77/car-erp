const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white";

export default function CarFilters({ current }: { current: Record<string, string | undefined> }) {
  return (
    <form method="get" className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Search</label>
        <input name="search" type="text" defaultValue={current.search} placeholder="Brand or model" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Min Price</label>
          <input name="minPrice" type="number" defaultValue={current.minPrice} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Max Price</label>
          <input name="maxPrice" type="number" defaultValue={current.maxPrice} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Min Year</label>
          <input name="minYear" type="number" defaultValue={current.minYear} className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Max Year</label>
          <input name="maxYear" type="number" defaultValue={current.maxYear} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Transmission</label>
        <select name="transmission" defaultValue={current.transmission ?? ""} className={inputClass}>
          <option value="">Any</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Fuel Type</label>
        <select name="fuelType" defaultValue={current.fuelType ?? ""} className={inputClass}>
          <option value="">Any</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Sort By</label>
        <select name="sortBy" defaultValue={current.sortBy ?? "created_at"} className={inputClass}>
          <option value="created_at">Newest</option>
          <option value="selling_price">Price</option>
          <option value="year">Year</option>
          <option value="mileage">Mileage</option>
        </select>
      </div>

      <button type="submit" className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
        Apply Filters
      </button>
    </form>
  );
}
