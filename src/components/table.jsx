import React from 'react'
//import styled from 'styled-components'
import { useTable } from 'react-table'
import { useState } from 'react'  
import { useFilters } from 'react'
import shadows from '@material-ui/core/styles/shadows'
//import makeData from './makeData'



 export default function Tabla() {
  


  const data = React.useMemo(
    () => [
      {
        
        col1: 'Juan',
        col2: 'lopez',
        col3: '4',
        
      },
      {
        col1: 'nico',
        col2: 'acevedo',
        col3: '5',
      },
      {
        col1: 'carlos',
        col2: 'zafon',
        col3: '6',
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Apellido',
        accessor: 'col2',
      },
      {
        Header: 'Numero',
        accessor: 'col3',
      }

    ],
    []
  )

 
  const [filterInput, setFilterInput] = React.useState();

  // Update the state when input changes
  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("data.col1",value)
    setFilterInput(value);
  };
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter
  } = useTable({ columns, data }, useFilters );

  return (
    <div>
      <label>Filter</label>
      <input
   
  value={filterInput}
  onChange={handleFilterChange}
  placeholder={"Search name"}
  /><table {...getTableProps()} style={{ border: 'solid 1px gray' }}>
  <thead>
    {headerGroups.map(headerGroup => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          <th
            {...column.getHeaderProps()}
            style={{
              borderBottom: 'solid 1px gray',
              background: 'aliceblue',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {column.render('Header')}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  
  <tbody {...getTableBodyProps()}>
    {rows.map((row, i) => {
      prepareRow(row)
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map(cell => {
            return (
              <td
                {...cell.getCellProps()}
                style={{
                  padding: '10px',
                  border: 'solid 1px gray',
                  background: 'white',
                }}
              >
                {cell.render('Cell')}
              </td>
            )
          })}
        </tr>
        
      )
      
    })}
  </tbody>
</table>
</div>
  
  )
  
}

