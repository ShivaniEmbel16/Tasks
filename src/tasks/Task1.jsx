// import React, { useState } from "react";

// const Task1 = () => {
//   const today = new Date();

//   const [open, setOpen] = useState(true);
//   const [viewDate, setViewDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(today);

//   const [hour, setHour] = useState(12);
//   const [minute, setMinute] = useState(30);
//   const [ampm, setAmPm] = useState("PM");

//   // -----------------------
//   // Calendar Helpers
//   // -----------------------

//   const daysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const firstDayOfMonth = new Date(
//     viewDate.getFullYear(),
//     viewDate.getMonth(),
//     1
//   ).getDay();

//   const generateCalendar = () => {
//     const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
//     const calendar = [];
//     let dayCounter = 1;

//     // 6 rows for full calendar grid
//     for (let row = 0; row < 6; row++) {
//       const rowDays = [];
//       for (let col = 0; col < 7; col++) {
//         if (row === 0 && col < firstDayOfMonth) {
//           rowDays.push("");
//         } else if (dayCounter > totalDays) {
//           rowDays.push("");
//         } else {
//           rowDays.push(dayCounter);
//           dayCounter++;
//         }
//       }
//       calendar.push(rowDays);
//     }

//     return calendar;
//   };

//   const goPrevMonth = () => {
//     const newDate = new Date(viewDate);
//     newDate.setMonth(viewDate.getMonth() - 1);
//     setViewDate(newDate);
//   };

//   const goNextMonth = () => {
//     const newDate = new Date(viewDate);
//     newDate.setMonth(viewDate.getMonth() + 1);
//     setViewDate(newDate);
//   };

//   const selectDay = (day) => {
//     if (!day) return;
//     const chosen = new Date(
//       viewDate.getFullYear(),
//       viewDate.getMonth(),
//       day
//     );

//     // prevent past date
//     if (chosen < today) return;

//     setSelectedDate(chosen);
//   };

//   // -----------------------
//   // Time Helpers
//   // -----------------------

//   const incHour = () => setHour((h) => (h === 12 ? 1 : h + 1));
//   const decHour = () => setHour((h) => (h === 1 ? 12 : h - 1));

//   const incMinute = () => setMinute((m) => (m === 59 ? 0 : m + 1));
//   const decMinute = () => setMinute((m) => (m === 0 ? 59 : m - 1));

//   const toggleAmPm = () => setAmPm((p) => (p === "AM" ? "PM" : "AM"));

//   // -----------------------
//   // Cancel / Set
//   // -----------------------

//   const onCancel = () => setOpen(false);

//   const onSet = () => {
//     const finalDate = new Date(selectedDate);
//     let hr = hour % 12;
//     if (ampm === "PM") hr += 12;
//     finalDate.setHours(hr);
//     finalDate.setMinutes(minute);

//     console.log("Final Selected:", finalDate);
//   };

//   const calendar = generateCalendar();

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//       <div className="bg-gradient-to-b from-[#121C48] to-[#0A0F24] text-white p-6 rounded-2xl shadow-xl w-[340px]">

//         {/* Month Header */}
//         <div className="flex justify-between items-center mb-4">
//           <button onClick={goPrevMonth} className="text-xl">
//             ◀
//           </button>

//           <h2 className="text-lg font-semibold">
//             {viewDate.toLocaleString("default", { month: "short" })}{" "}
//             {viewDate.getFullYear()}
//           </h2>

//           <button onClick={goNextMonth} className="text-xl">
//             ▶
//           </button>
//         </div>

//         {/* Week Days */}
//         <div className="grid grid-cols-7 text-center text-gray-300 mb-2">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>

//         {/* Calendar Days */}
//         {calendar.map((row, i) => (
//           <div key={i} className="grid grid-cols-7 text-center my-1">
//             {row.map((day, idx) => {
//               const isSelected =
//                 day &&
//                 new Date(
//                   viewDate.getFullYear(),
//                   viewDate.getMonth(),
//                   day
//                 ).toDateString() === selectedDate.toDateString();

//               const isPast =
//                 day &&
//                 new Date(
//                   viewDate.getFullYear(),
//                   viewDate.getMonth(),
//                   day
//                 ) < today;

//               return (
//                 <div
//                   key={idx}
//                   onClick={() => selectDay(day)}
//                   className={`
//                     py-1 cursor-pointer rounded-full mx-auto w-9
//                     ${
//                       day
//                         ? isSelected
//                           ? "bg-teal-400 text-black font-semibold"
//                           : isPast
//                           ? "text-gray-500 opacity-40 cursor-not-allowed"
//                           : "hover:bg-gray-700"
//                         : ""
//                     }
//                   `}
//                 >
//                   {day || ""}
//                 </div>
//               );
//             })}
//           </div>
//         ))}

//         {/* Time Picker */}
//         <div className="flex items-center justify-center mt-6 gap-4">
//           {/* Hour */}
//           <div className="flex flex-col items-center">
//             <button onClick={incHour}>▲</button>
//             <div className="bg-white text-black w-12 text-center py-1 rounded">
//               {hour.toString().padStart(2, "0")}
//             </div>
//             <button onClick={decHour}>▼</button>
//           </div>

//           <div className="text-xl">:</div>

//           {/* Minute */}
//           <div className="flex flex-col items-center">
//             <button onClick={incMinute}>▲</button>
//             <div className="bg-white text-black w-12 text-center py-1 rounded">
//               {minute.toString().padStart(2, "0")}
//             </div>
//             <button onClick={decMinute}>▼</button>
//           </div>

//           {/* AM/PM */}
//           <button
//             onClick={toggleAmPm}
//             className="border px-3 py-2 rounded-lg"
//           >
//             {ampm}
//           </button>
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onCancel}
//             className="text-gray-300 hover:text-white"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onSet}
//             className="text-teal-400 font-semibold"
//           >
//             Set
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Task1;



import React, { useState } from "react";

const Task1 = () => {
  const today = new Date();

  const [open, setOpen] = useState(false); // 🔹 initially closed
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
 const [showMsg, setShowMsg] = useState(true);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(30);
  const [ampm, setAmPm] = useState("PM");

  const [appliedDate, setAppliedDate] = useState(null);

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  const generateCalendar = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const calendar = [];
    let dayCounter = 1;

    for (let row = 0; row < 6; row++) {
      const rowDays = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDayOfMonth) {
          rowDays.push("");
        } else if (dayCounter > totalDays) {
          rowDays.push("");
        } else {
          rowDays.push(dayCounter);
          dayCounter++;
        }
      }
      calendar.push(rowDays);
    }

    return calendar;
  };

  const goPrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const selectDay = (day) => {
    if (!day) return;

    const chosen = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day
    );

    if (chosen < today) return;

    setSelectedDate(chosen);
  };

  const incHour = () => setHour((h) => (h === 12 ? 1 : h + 1));
  const decHour = () => setHour((h) => (h === 1 ? 12 : h - 1));

  const incMinute = () => setMinute((m) => (m === 59 ? 0 : m + 1));
  const decMinute = () => setMinute((m) => (m === 0 ? 59 : m - 1));

  const toggleAmPm = () => setAmPm((p) => (p === "AM" ? "PM" : "AM"));

  const applyToday = () => {
    const d = new Date();
    setSelectedDate(d);
    setViewDate(d);
  };

  const applyLast7Days = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    if (d < today) return;
    setSelectedDate(d);
    setViewDate(d);
  };

  const applyThisMonth = () => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    setSelectedDate(d);
    setViewDate(d);
  };

  const onCancel = () => setOpen(false); // 🔹 hide UI on cancel

  const onSet = () => {
    const finalDate = new Date(selectedDate);
    let hr = hour % 12;
    if (ampm === "PM") hr += 12;
    finalDate.setHours(hr);
    finalDate.setMinutes(minute);

    setAppliedDate(finalDate);

    alert("Selected Date & Time:\n" + finalDate.toLocaleString());
  };

  const calendar = generateCalendar();

  return (
        <div className=" p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="p-3">

      {/* 🔹 SHOW THIS BUTTON ALWAYS */}
 {!open && (
  <div className="flex flex-col items-center">
    <button
      onClick={() => {
        setOpen(true);
        setShowMsg(false);
      }}
      className="px-4 py-2 bg-teal-500 text-black rounded-lg font-semibold"
    >
      DateTime Picker
    </button>

    {showMsg && (
      <p className="text-gray-600 text-sm mt-2">
        Click Me to Open DateTime Picker
      </p>
    )}
  </div>
)}

      {/* 🔹 SHOW CALENDAR ONLY WHEN OPEN */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#121C48] to-[#0A0F24] text-white p-6 rounded-2xl shadow-xl w-[360px]">

            <div className="flex gap-2 mb-4">
              <button
                onClick={applyToday}
                className="px-3 py-1 bg-teal-500 rounded-lg text-black text-sm font-semibold hover:bg-teal-400"
              >
                Today
              </button>
              <button
                onClick={applyLast7Days}
                className="px-3 py-1 bg-gray-300 rounded-lg text-black text-sm font-semibold hover:bg-gray-200"
              >
                Last 7 Days
              </button>
              <button
                onClick={applyThisMonth}
                className="px-3 py-1 bg-gray-300 rounded-lg text-black text-sm font-semibold hover:bg-gray-200"
              >
                This Month
              </button>
            </div>

            <div className="flex justify-between items-center mb-3">
              <button onClick={goPrevMonth} className="text-xl">◀</button>

              <h2 className="text-lg font-semibold">
                {viewDate.toLocaleString("default", { month: "short" })}{" "}
                {viewDate.getFullYear()}
              </h2>

              <button onClick={goNextMonth} className="text-xl">▶</button>
            </div>

            <div className="grid grid-cols-7 text-center text-gray-300 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {calendar.map((row, i) => (
              <div key={i} className="grid grid-cols-7 text-center my-1">
                {row.map((day, idx) => {
                  const isSelected =
                    day &&
                    new Date(
                      viewDate.getFullYear(),
                      viewDate.getMonth(),
                      day
                    ).toDateString() === selectedDate.toDateString();

                  const isPast =
                    day &&
                    new Date(viewDate.getFullYear(), viewDate.getMonth(), day) <
                      today;

                  return (
                    <div
                      key={idx}
                      onClick={() => selectDay(day)}
                      className={`py-1 cursor-pointer rounded-full mx-auto w-9
                        ${
                          day
                            ? isSelected
                              ? "bg-teal-400 text-black font-semibold"
                              : isPast
                              ? "text-gray-500 opacity-40 cursor-not-allowed"
                              : "hover:bg-gray-700"
                            : ""
                        }`}
                    >
                      {day || ""}
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="flex items-center justify-center mt-5 gap-4">
              <div className="flex flex-col items-center">
                <button onClick={incHour}>▲</button>
                <div className="bg-white text-black w-12 text-center py-1 rounded">
                  {hour.toString().padStart(2, "0")}
                </div>
                <button onClick={decHour}>▼</button>
              </div>

              <div className="text-xl">:</div>

              <div className="flex flex-col items-center">
                <button onClick={incMinute}>▲</button>
                <div className="bg-white text-black w-12 text-center py-1 rounded">
                  {minute.toString().padStart(2, "0")}
                </div>
                <button onClick={decMinute}>▼</button>
              </div>

              <button
                onClick={toggleAmPm}
                className="border px-3 py-2 rounded-lg"
              >
                {ampm}
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={onCancel} className="text-gray-300 hover:text-white">
                Cancel
              </button>

              <button onClick={onSet} className="text-teal-400 font-semibold">
                Set
              </button>
            </div>

          </div>
        </div>
      )}
    </div></div>
  );
};

export default Task1;
