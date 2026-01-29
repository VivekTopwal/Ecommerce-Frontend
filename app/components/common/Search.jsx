import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  return (
    <div className="search bg-[#E6E6E6] w-150 h-12.5 rounded-md px-4 relative border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.3)]">
      <input
        type="text"
        placeholder="Search..."
        className="w-full text-gray-400 h-full outline-none border-0"
      />
      <button className="w-10 h-10 rounded-full absolute top-1.25 right-2 z-50 flex items-center justify-center cursor-pointer hover:bg-gray-300">
         <IoSearchOutline
        size={20}
      />
      </button>
     
    </div>
  );
};

export default Search;
