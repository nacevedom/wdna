import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Time = () => {
  const [startDate, setStartDate] = useState(new Date());
  let datetime = "";
  let txt = this.props.Time();
  const GetData = React.createContext({
    date: datetime,
  });
  return (
    <DatePicker
      dateFormat="yyyy-MMM-dd"
      selected={startDate}
      onChange={(date) => {
        var dateFormat = require("dateformat");
        setStartDate(date);
        datetime = dateFormat(date, "yyyy-mmm-dd");
        console.log(datetime);
      }}
    >
      <p>{txt}</p>
    </DatePicker>
  );
};
export default Time;
