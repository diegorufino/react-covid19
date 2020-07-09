import React, { Component } from 'react';
import { formatDate } from './Util';
import { list } from './listContries'

class App extends Component {

  state = {
    cases: '',
    country: '',
    totalConfirmed: '',
    totalRecovered: '',
    totalDeaths: '',
    casesDate: '',
    listCountry: '',
    countryDate: '',
    dateFrom: '',
    dateTo: ''
  }

  async componentDidMount() {

    const response = await fetch('https://api.covid19api.com/summary');
    const dataCasesJson = await response.json();

    this.setState({
      cases: dataCasesJson,
      country: '',
      totalConfirmed: '-',
      totalRecovered: '-',
      totalDeaths: '-',
      casesDate: '',
      listCountry: list,
      countryDate: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  paisSelecionado = (event) => {
    const { cases, casesDate, listCountry } = this.state;

    let i = event.target.value;

    let country = '';
    let totalConfirmed = '-';
    let totalRecovered = '-';
    let totalDeaths = '-';

    if (i) {
      country = cases.Countries[i].Country;
      totalConfirmed = cases.Countries[i].TotalConfirmed;
      totalRecovered = cases.Countries[i].TotalRecovered;
      totalDeaths = cases.Countries[i].TotalDeaths;
    }

    this.setState({
      cases: cases,
      country: country,
      totalConfirmed: totalConfirmed,
      totalRecovered: totalRecovered,
      totalDeaths: totalDeaths,
      casesDate: casesDate,
      listCountry: listCountry,
      countryDate: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  paisData = (event) => {
    const { cases, casesDate, listCountry } = this.state;

    let name = event.target.name;
    let value = event.target.value;

    this.setState({
      cases: cases,
      country: this.state.country,
      totalConfirmed: this.state.totalConfirmed,
      totalRecovered: this.state.totalRecovered,
      totalDeaths: this.state.totalDeaths,
      casesDate: casesDate,
      listCountry: listCountry,
      [name]: value
    })
  }

  onSubmit = () => {
    this.carregar();
  }

  async carregar() {

    const { cases, listCountry } = this.state;

    let country = this.state.countryDate;
    let dateFrom = this.state.dateFrom;
    let dateTo = this.state.dateTo;

    const responseDate = await fetch('https://api.covid19api.com/country/' + country + '/status/confirmed/live?from=' + dateFrom + 'T00:00:01Z&to=' + dateTo + 'T23:59:59Z');
    const dataCasesDateJson = await responseDate.json();

    this.setState({
      cases: cases,
      country: this.state.country,
      totalConfirmed: this.state.totalConfirmed,
      totalRecovered: this.state.totalRecovered,
      totalDeaths: this.state.totalDeaths,
      casesDate: dataCasesDateJson || [],
      listCountry: listCountry,
      countryDate: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  render() {
    const { cases, totalConfirmed, totalRecovered, totalDeaths, casesDate, listCountry } = this.state;

    return (
      <div className="form" >

        {/* CASOS NO MUNDO */}
        < div className="jumbotron" >
          <h4 className="center">Covid 19 no mundo</h4>

          <div className="row">

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Casos Confirmados</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {cases && cases.Global && cases.Global.TotalConfirmed}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Total de Recuperados</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {cases && cases.Global && cases.Global.TotalRecovered}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Total de Mortes</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {cases && cases.Global && cases.Global.TotalDeaths}
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div >

        {/* CASOS POR PAIS */}
        < div className="jumbotron" >

          <h4 className="center">Casos por País</h4>

          <div className="row">

            <div className="col-md-4">
              <div className="form-group">
                <label className="Select1">País</label>
                <select className="form-control" onChange={this.paisSelecionado} id="Select1">
                  <option value="">Selecione</option>
                  {cases && cases.Countries && cases.Countries.map((c, i) =>
                    <option key={i} value={i}>{c.Country}</option>)}
                </select>
              </div>
            </div>

          </div>

          <div className="row">

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Casos Confirmados</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {totalConfirmed}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Total de Recuperados</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {totalRecovered}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-primary mb-3">
                <div className="card-header center">Total de Mortes</div>
                <div className="card-body">
                  <h4 className="card-title center">
                    {totalDeaths}
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div >

        {/* CASOS POR PERIODO */}
        < div className="jumbotron" >
          <h4 className="center">Casos confirmados por período</h4>

          <div className="row">

            <div className="col-md-4">
              <div className="form-group">
                <label className="countryDate">País {this.state.countryDate}</label>
                <select className="form-control" name="countryDate" onChange={this.paisData} id="countryDate">
                  <option value="">Selecione</option>
                  {listCountry && listCountry.map((c) =>
                    <option key={c.Slug} value={c.Slug}>{c.Country}</option>)}
                </select>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group">
                <label className="col-form-label">De </label>
                <input type="date" name="dateFrom" onChange={this.paisData} className="form-control" id="dateFrom" />
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group">
                <label className="col-form-label">Até</label>
                <input type="date" name="dateTo" onChange={this.paisData} className="form-control" id="dateTo" />
              </div>
            </div>

            <div className="col-md-1">
              <div className="form-group">
                <label className="col-form-label">&nbsp;&nbsp;&nbsp;</label>
                <button type="button" onClick={this.onSubmit} className="btn btn-primary">Buscar</button>
              </div>
            </div>

          </div>

          <div className="row">
            {casesDate && casesDate.map((cd, i) =>
              <div key={i} className="col-md-4">
                <div className="card border-primary mb-3">
                  <div className="card-header center">{formatDate(cd.Date)}</div>
                  <div className="card-body">
                    <h4 className="card-title center">
                      {cd.Cases}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div >

      </div >
    );
  }
}

export default App;