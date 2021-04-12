import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { matchSorter } from "match-sorter";
import "../assets/styles/table.scss";
import Table from "react-bootstrap/Table";

function CharacterCard(props) {
  const { character } = props;

  return (
    <div
      className="CharacterCard"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      <div className="CharacterCard__name-container text-truncate">
        {character.description}
      </div>
    </div>
  );
}

class App extends React.Component {
  state = {
    loading: true,
    error: null,
    data: {
      weather: [],
    },
  };

  componentDidMount() {
    this.fetchCharacters();
  }

  fetchCharacters = async () => {
    this.setState({ loading: true, error: null });

    const response = await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=London&appid=af7483e057bb688e60ade94eb3b7ac5f"
    );
    const data = await response.json();

    this.setState({
      data: data,
    });
  };

  render() {
    if (this.state.error) {
      return "Error!";
    }

    return (
      <div className="container">
        <div className="App">
          <img className="Logo" alt="Rick y Morty" />
          <Table striped bordered hover>
            <tbody>
              <tr className="row">
                {this.state.data.weather.map((character) => (
                  <td className="col-6 col-md-3" key={character.id}>
                    <CharacterCard character={character} />
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
