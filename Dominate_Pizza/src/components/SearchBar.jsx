import { useState } from 'react';

const SearchBar = ({ onSearch = () => {}, className = '', autoFocus = false }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    onSearch(v); // ส่งค่าทุกครั้งที่พิมพ์
  };

  return (
    <input
      type="text"
      autoFocus={autoFocus}
      className={`rounded-lg px-4 py-2 w-full bg-gray-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition ${className}`}
      placeholder="Search your meal"
      value={query}
      onChange={handleChange}
    />
  );
};

export default SearchBar;
