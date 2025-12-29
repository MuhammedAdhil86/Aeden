// "use client";
// import React from "react";

// /**
//  * SearchInput
//  * Props:
//  *  - value: string
//  *  - onChange: (val: string) => void
//  *  - placeholder: string
//  *  - showClear?: boolean  (optional, clears input)
//  */
// const SearchInput = ({ value, onChange, placeholder = "Search...", showClear }) => {
//   return (
//     <div className="p-2 border-b bg-white">
//       <div className="relative">
//         <input
//           autoFocus
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder={placeholder}
//           className="w-full px-3 py-2 text-sm rounded-md bg-white border
//                     "
//         />

//         {showClear && value && (
//           <button
//             type="button"
//             onClick={() => onChange("")}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             aria-label="clear search"
//           >
//             ✕
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchInput;
"use client";
import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchInput
 * Props:
 *  - value: string
 *  - onChange: (val: string) => void
 *  - placeholder: string
 *  - showClear?: boolean  (optional, clears input)
 */
const SearchInput = ({ value, onChange, placeholder = "Search...", showClear }) => {
  return (
    <div className="p-3 border-b border-gray-200 bg-white">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-xs rounded-md bg-gray-50
                     placeholder:text-gray-400 text-gray-900
                     focus:outline-none focus:bg-white
                     transition-all duration-200
                     hover:border-gray-300"
        />

        {showClear && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-700 
                       hover:bg-gray-100 rounded-md p-1
                       transition-colors duration-150"
            aria-label="clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;