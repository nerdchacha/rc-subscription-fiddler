import { Table as MuiTable, TableBody, TableRow, TableCell } from '@mui/material'

const Table  = ({text}) => {
  const rows = text.split('\n')
  const renderData = rows.map((row, i) => {
    const renderCell = row.split('|').map((cell, j) => <TableCell key={j} size='small'>{cell}</TableCell>)
    return (
      <TableRow key={i}>{renderCell}</TableRow>
    )
  })
  return (
    <MuiTable>
      <TableBody>
        {renderData}
      </TableBody>
    </MuiTable>
  )
}

export default Table