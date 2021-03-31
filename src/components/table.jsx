import React from "react";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { matchSorter } from 'match-sorter';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
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
          border: "0"
        }}
      />
    </span>
  );
}
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}
function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  );

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter }
  }) {
    const count = preFilteredRows.length;
    
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  fuzzyTextFilterFn.autoRemove = val => !val

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes
    },
    useFilters,
    useGlobalFilter
  );

  // Render the UI for your table
  return (
    
    <table
      {...getTableProps()}
      border={1}
      style={{ borderCollapse: "collapse", width: "100%" }}
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
              
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          
          {
            Header: 'Visits',
            accessor: 'visits',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
          },
          
        ],
      },
    ],
    []
    
    
  
  );

  const data = React.useMemo(
    () => [
      {
        firstName: "Row 1 Column 1",
        visits: "Row 1 Column 2",
        lastName: "Row 1 Column 3"
      },
      {
        firstName: "Row 2 Column 1",
        visits: "Row 2 Column 2",
        lastName: "Row 2 Column 3"
      },
      {
        firstName: "Row 3 Column 1",
        visits: "Row 3 Column 2",
        lastName: "Row 3 Column 3"
      },
      {
        firstName: "Row 4 Column 1",
        visits: "Row 4 Column 2",
        lastName: "Row 4 Column 3"
      },
      {
        firstName: "Row 5 Column 1",
        visits: "Row 5 Column 2",
        lastName: "Row 5 Column 3"
      },
      {
        firstName: "Row 6 Column 1",
        visits: "Row 6 Column 2",
        lastName: "Row 6 Column 3"
      },
      {
        firstName: "Row 7 Column 1",
        visits: "Row 7 Column 2",
        lastName: "Row 7 Column 3"
      },
      {
        firstName: "Row 8 Column 1",
        visits: "Row 8 Column 2",
        lastName: "Row 8 Column 3"
      },
      {
        firstName: "Row 9 Column 1",
        visits: "Row 9 Column 2",
        lastName: "Row 9 Column 3"
      },
      {
        firstName: "Row 10 Column 1",
        visits: "Row 10 Column 2",
        lastName: "Row 10 Column 3"
      },
      {
        firstName: "Row 11 Column 1",
        visits: "Row 11 Column 2",
        lastName: "Row 11 Column 3"
      },
      {
        firstName: "Row 12 Column 1",
        visits: "Row 12 Column 2",
        lastName: "Row 12 Column 3"
      }
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}

export default App;


