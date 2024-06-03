import dayjs from "dayjs";
import { generateDate, months } from "../utils/calender.js";
import cn from "../utils/cn.js";
import { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import axios from "axios";

const Home = () => {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectdate] = useState(currentDate);
  const [birthdays, setBirthdays] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBirthdays(selectDate);
  }, [selectDate]);

  const fetchBirthdays = async (date) => {
    const fetchDate = date.toDate().toDateString().split(" ")[2];
    const mon = date.month() < 10 ? `0${date.month()}` : `${date.month()}`;
    const response = await axios.get(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${mon}/${fetchDate}`
    );
    const resData = response.data.births.slice(0, 8);
    setBirthdays(resData);
    setLoading(false);
  };

  const birthdates = selectDate.toDate().toDateString().split(" ");

  return (
    <div className="flex w-1/2 mx-auto divide-x-2 gap-10 h-screen items-center ">
      <div className="w-[400px] h-96">
        <div className="flex justify-between">
          <h1 className="font-semibold text-xl">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex items-center gap-5">
            <GrFormPrevious
              className="w-5 h-5 cursor-pointer"
              onClick={() => setToday(today.month(today.month() - 1))}
            />
            <h1
              className="cursor-pointer"
              onClick={() => setToday(currentDate)}
            >
              Today
            </h1>
            <GrFormNext
              className="w-5 h-5 cursor-pointer"
              onClick={() => setToday(today.month(today.month() + 1))}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-7 text-gray-500">
          {weekDays.map((day, index) => {
            return (
              <h1
                key={index}
                className="h-14 grid place-content-center text-md font-semibold"
              >
                {day}
              </h1>
            );
          })}
        </div>
        <div className="w-full grid grid-cols-7">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              return (
                <div
                  key={index}
                  className="h-14 border-t grid place-content-center text-sm"
                >
                  <h1
                    className={cn(
                      currentMonth ? "" : "text-gray-400",
                      today ? "bg-red-600 text-white" : "",
                      selectDate.toDate().toDateString() ===
                        date.toDate().toDateString()
                        ? "bg-black text-white"
                        : "",
                      "h-10 w-10 grid place-content-center rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
                    )}
                    onClick={() => {
                      setSelectdate(date);
                      setLoading(true);
                    }}
                  >
                    {date.date()}
                  </h1>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div>
        <div className="w-[500px] h-96 px-5">
          <h1 className="font-semibold text-xl mb-2">
            Birthdays on {birthdates[1]} {birthdates[2]}
          </h1>
          <div>
            {loading ? (
              <ul>
                {Array.from({ length: 8 }).map((_, index) => (
                  <li
                    key={index}
                    className="bg-gray-200 transition-all h-6 my-5 rounded-md"
                  ></li>
                ))}
              </ul>
            ) : birthdays?.length ? (
              <ul>
                {birthdays &&
                  birthdays.map((birthday, index) => (
                    <li key={index} className="text-lg pb-4 ml-4 font-semibold">
                      {birthday.text.split(",")[0]} (
                      {birthday.text.split(",")[1]})
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No favourite birthdays</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
