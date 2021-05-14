import React, { useState, useEffect } from "react";
import "../assets/styles/table.scss";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = (theme) => ({
  table: {
    minWidth: 700,
    tableLayout: "fixed",
  },
  sticky: {
    position: "sticky",
    top: 0,
  },
  tableContainer: {
    height: 500,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: "",
      data: [],
      result: [],
    };
    // const classes = useStyles();
    // const [product, setProduct] = useState([]);
    // const [search, setSearch] = useState("");
  }
  insertData = () => {
    fetch(
      "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var result = [];
        this.setState({
          data: (function getResult() {
            data.forEach((item) => {
              result.push(item);
            });
            return result;
          })(),
          result: result,
        });
      });
  };

  handleChange = (e) => {
    this.setState({
      temp: e.target.value,
    });
    this.filterTemp(e.target.value);
  };

  filterTemp = (temp) => {
    this.setState({
      result: this.state.data.filter((n) => n >= temp),
    });
  };
  componentDidMount() {
    this.insertData();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="container-fluid">
        <input
          type="text"
          placeholder="Search here"
          className="form-control"
          name="temp"
          onChange={this.handleChange}
          // onChange={(e) => {
          //   setSearch(e.target.value);
          // }}
        />
        {/* {product
          .filter((item) => {
            if (search === "") {
              return item;
            } else if (item.name.toLowerCase().includes(search.toLowerCase())) {
              return item;
            }
          })
          .map((item) => {
            return (
              <p>
                {item.datetime} - {item.wind}
              </p>
            );
          })}{" "} */}
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.sticky} align="center">
                  Temperatures
                </StyledTableCell>
                <StyledTableCell className={classes.sticky} align="center">
                  Wind
                </StyledTableCell>
                <StyledTableCell className={classes.sticky} align="center">
                  Datetime
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.result.map((item) => {
                return (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {item.temperature}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.wind}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.datetime}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
