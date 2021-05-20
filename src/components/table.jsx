import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import "../assets/styles/table.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
}

// function Datepiker({ column: { filterValue = [], setFilter } }) {
//   var dateFormat = require("dateformat");

//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(null);
//   const onChange = (dates) => {
//     const [start, end] = dates || undefined;
//     console.log(filterValue);
//     setStartDate(start);
//     setEndDate(end);
//     setFilter([start, end]);
//     console.log(filterValue);
//     console.log(dates);

//   const [startDate, setStartDate] = useState(new Date("2021 / 03 / 29"));
//   const [endDate, setEndDate] = useState(null);

//   const onChange = (date) => {
//     const [start, end] = date;
//     const value = date;
//     setStartDate(start);
//     setEndDate(end);
//     var startt = dateFormat(start, "yyyy-mm-dd");
//     var endd = dateFormat(end, "yyyy-mm-dd");

//     var filterValue = [];

//     init();

//     function init() {
//       filterValue.push(startt);
//       filterValue.push(endd);
//     }

//     var p = dateFormat(value, "yyyy-mm-dd");

//     setFilter(filterValue);

//     console.log(filterValue);
//     filterValue = [];
//     console.log(filterValue);
//   };
//   return <DatePicker selected={startDate} onChange={onChange} />;
//   }
//   return (
//     <DatePicker
//       selected={startDate}
//       onChange={onChange}
//       startDate={startDate}
//       endDate={endDate}
//       dateFormat="yyyy/MM/dd"
//       selectsRange
//     />
//   );
// }}

// function Prueba({ column: { setFilter, filterValue } }) {

//   const handleFilterChange = (e) => {
//     const value = e.target.value || undefined;
//     setFilter(value);
//   };
//   return (
//     <input
//       value={filterValue || ""}
//       onChange={handleFilterChange}
//       placeholder={"Search name"}
//     />
//   );
// }

function dateBetweenFilterFn(rows, id, filterValues) {
  let sd = filterValues[0] ? new Date(filterValues[0]) : undefined;
  let ed = filterValues[1] ? new Date(filterValues[1]) : undefined;

  if (ed || sd) {
    return rows.filter((r) => {
      var time = new Date(r.values[id]);

      if (ed && sd) {
        return time >= sd && time <= ed;
      } else if (sd) {
        return time >= sd;
      } else if (ed) {
        return time <= ed;
      }
    });
  } else {
    return rows;
  }
}

function DateRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length
      ? new Date(preFilteredRows[0].values[id])
      : new Date(0);
    let max = preFilteredRows.length
      ? new Date(preFilteredRows[0].values[id])
      : new Date(0);

    preFilteredRows.forEach((row) => {
      const rowDate = new Date(row.values[id]);

      min = rowDate <= min ? rowDate : min;
      max = rowDate >= max ? rowDate : max;
    });

    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div>
      <input
        min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? val : undefined, old[1]]);
        }}
        type="date"
        value={filterValue[0] || ""}
      />
      {" to "}
      <input
        max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? val.concat("T23:59:59.999Z") : undefined,
          ]);
        }}
        type="date"
        value={filterValue[1]?.slice(0, 10) || ""}
      />
    </div>
  );
}

dateBetweenFilterFn.autoRemove = (val) => !val;

function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div className="container-fluid">
      <div className="row">
        <input
          value={filterValue[0] || ""}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
            console.log(filterValue);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: "70px",
            marginRight: "0.5rem",
          }}
        />
        to
        <input
          value={filterValue[1] || ""}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
            console.log(filterValue);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: "70px",
            marginLeft: "0.5rem",
          }}
        />
      </div>
    </div>
  );
}
function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }
  const filterTypes = React.useMemo(
    () => ({
      dateBetween: dateBetweenFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  // Render the UI for your table
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
      <table
        {...getTableProps()}
        border={1}
        className="table"
        style={{
          borderCollapse: "collapse",
          overflow: "scroll",
          width: "100%",
        }}
      >
        <thead>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}

                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              className="celdas"
              style={{
                textAlign: "left",
              }}
            ></th>
          </tr>
        </thead>
        <tbody
          {...getTableBodyProps()}
          style={{
            overflow: "scroll",
          }}
        >
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="celdas" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Temperature",

        columns: [
          {
            Header: "ID",
            accessor: "id",
          },
          {
            Header: "Temperature",
            accessor: "temperature",
          },
          {
            Header: "Humidity",
            accessor: "humidity",
            Filter: NumberRangeColumnFilter,
            filter: "between",
          },
          {
            Header: "Datetime",
            accessor: "datetime",
            Filter: DateRangeColumnFilter,
            filter: dateBetweenFilterFn,
          },
        ],
      },
    ],
    []
  );

  const [product, setProduct] = useState([]);
  const getProductData = async () => {
    try {
      const data = await axios.get(
        "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-27%2013:00:00&end=2021-03-30%2013:00:00"
      );

      setProduct(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  return <Table columns={columns} data={product} />;
}

export default App;
