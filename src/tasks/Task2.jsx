import React, { useState, useEffect, useRef } from "react";

const Task2 = () => {
  // Stores all dropdown options (from API / async load)
  const [options, setOptions] = useState([]);

  // Stores filtered options based on search
  const [filtered, setFiltered] = useState([]);

  // Stores selected items
  const [selected, setSelected] = useState([]);

  // Search input state
  const [search, setSearch] = useState("");

  // Manage dropdown open/close
  const [open, setOpen] = useState(false);

  // For keyboard navigation highlight
  const [highlightIndex, setHighlightIndex] = useState(0);

  // References for outside click + auto-focus
  const ref = useRef(null);
  const searchRef = useRef(null);

  /* ---------------------------------------------
     ASYNC LOADING OF DROPDOWN OPTIONS (SIMULATION)
     --------------------------------------------- */
  useEffect(() => {
    setTimeout(() => {
      const data = [
        "Office Space",
        "Plot",
        "Shop",
        "Penthouse",
        "Flat",
        "Warehouse",
      ];
      setOptions(data);
      setFiltered(data); // initial display
    }, 500);
  }, []);

  /* ---------------------------------------------
     SEARCH FILTER LOGIC
     --------------------------------------------- */
  useEffect(() => {
    setFiltered(
      options.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      )
    );

    // Reset highlighted index on new search
    setHighlightIndex(0);
  }, [search, options]);

  /* ---------------------------------------------
     CLOSE DROPDOWN ON OUTSIDE CLICK
     --------------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------------------------------
     TOGGLE SELECT / UNSELECT ITEM
     --------------------------------------------- */
  const toggleItem = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((x) => x !== item)); // remove
    } else {
      setSelected([...selected, item]); // add
    }
  };

  /* ---------------------------------------------
     CLEAR ALL SELECTED ITEMS
     --------------------------------------------- */
  const clearAll = () => {
    setSelected([]);
    setSearch("");
    setFiltered(options);
  };

  /* ---------------------------------------------
     KEYBOARD ACCESSIBILITY HANDLING
     ArrowUp / ArrowDown - navigate
     Enter - select/unselect
     Escape - close
     --------------------------------------------- */
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      toggleItem(filtered[highlightIndex]);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
         <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
    <div className="w-full max-w-md p-4">
    
      <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
        {/* ---------------------------------------------
           MAIN INPUT BOX (CLICK TO OPEN DROPDOWN)
           --------------------------------------------- */}
       <div
  className="flex flex-wrap items-center gap-2 border border-green-300 rounded-md px-2 py-2 cursor-pointer bg-white relative"
  onClick={() => {
    setOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }}
>
  {/* Placeholder when nothing selected */}
  {selected.length === 0 ? (
    <span className="text-gray-400">Select options…</span>
  ) : (
    selected.map((item) => (
      <span
        key={item}
        className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm"
      >
        {item}
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent dropdown toggle
            toggleItem(item);
          }}
        >
          ✕
        </button>
      </span>
    ))
  )}

  {/* Dropdown Arrow */}
  <span className="ml-auto flex items-center gap-2">
    {/* Clear All inside input */}
    {selected.length > 0 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearAll();
        }}
        className="text-gray-500 hover:text-red-500"
      >
        ✕
      </button>
    )}
    <span>{open ? "▲" : "▼"}</span>
  </span>
</div>

        {/* ---------------------------------------------
           CLEAR ALL BUTTON
           --------------------------------------------- */}
        {/* {selected.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm mt-1 text-red-500 underline"
          >
            Clear
          </button>
        )} */}

        {/* ---------------------------------------------
           DROPDOWN LIST
           --------------------------------------------- */}
        {open && (
          <div className="absolute mt-1 w-full bg-white shadow-lg border rounded-md z-20 max-h-60 overflow-auto">
            {/* SEARCH INPUT */}
            <input
              ref={searchRef}
              autoFocus
              className="w-full px-3 py-2 border-b outline-none"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* NO RESULT MESSAGE */}
            {filtered.length === 0 ? (
              <p className="p-2 text-gray-400">No results found</p>
            ) : (
              /* OPTIONS LIST */
              filtered.map((item, index) => {
                const isSelected = selected.includes(item);
                const isHighlighted = index === highlightIndex;

                return (
                  <div
                    key={item}
                    onClick={() => toggleItem(item)}
                    className={`px-3 py-2 cursor-pointer text-sm 
                      ${isHighlighted ? "bg-green-200" : "hover:bg-green-100"}
                      ${isSelected ? "bg-green-50 font-semibold" : ""}
                    `}
                  >
                    {item}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Task2;
