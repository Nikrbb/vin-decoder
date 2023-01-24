import './decoder.scss'
import React from "react";
import axios from 'axios';

class Decoder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vinInputValue: null,
            recentlyViewedList: [],
            vinData: {},
            loading: true
        }
    }

    componentDidMount() {
        let viewedList = JSON.parse(localStorage.getItem('viewedList'));

        this.setState( { recentlyViewedList: viewedList ? viewedList : [], loading: false });
    };
    validateInput() {
        let obj = {};
        if (!this.state.vinInputValue) {

            obj.message =  "Vin code can`t be empty";
            this.setState({vinData: obj});
            return false;

        } else if (this.state.vinInputValue.length > 17) {

            obj.message =  "Vin code can`t have more than 17 characters";
            this.setState({vinData: obj});
            return false;
        // eslint-disable-next-line
        } else if ( /^(?=.*[!@#$%^&(),.+=/\/\]\[{}?><":;|])/.test(this.state.vinInputValue) ) {

            obj.message =  "Vin code can`t have forbidden characters";
            this.setState({vinData: obj});
            return false;

        } else return true;

    };
    sendRequest(vinToDecode) {
        axios.get( `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${ vinToDecode }?format=json` )
            .then(( response) => {

                let vinResponse = {
                    searchedVin: response.data.SearchCriteria,
                    message: response.data.Message,
                    results: response.data.Results.filter(elem => !!elem.Value)
                }
                this.setState({ vinData: vinResponse });

                if (!this.state.recentlyViewedList.includes(vinToDecode)) {

                    let viewedList = [...this.state.recentlyViewedList, vinToDecode];
                    if (viewedList.length > 5) viewedList.splice(0, 1);

                    this.setState({ recentlyViewedList: viewedList });
                    localStorage.setItem('viewedList', JSON.stringify(viewedList));

                }
                this.setState({loading: false});

            }).catch( error => console.log(error) );
    };
    getVinData(vin) {

        // here we validate input value only if function was called
        // by btn "send request" not by recently viewed item
        if (!vin) if (!this.validateInput()) return;

        const vinToDecode = vin ? vin : this.state.vinInputValue;

        this.setState({ loading: true });

        this.sendRequest(vinToDecode)
    };

    render() {
        const MsgFromRequest = () => {
            if (!Object.keys(this.state.vinData).length) return (
                <div className="decoder__empty-msg">
                    <span>Area for message from response</span>
                </div>
            )
            else return <div className="decoder__message">
                <span>response message</span>
                <p >{this.state.vinData.message}</p>
            </div>
        }

        const RecentlyViewedVinCodes = () => {
            if (this.state.recentlyViewedList.length) {
                return (
                    <div className="decoder__viewed">
                        <h5>Recently viewed:</h5>
                        <ul>
                            {this.state.recentlyViewedList.map(vin => <li key={vin}>
                                <span className="decoder__viewed-link" onClick={() => this.getVinData(vin) }>{ vin }</span>
                            </li>)}
                        </ul>
                    </div>
                )
            } else return null
        };

        const VinCodeDataList = () => {
            const { searchedVin } = this.state.vinData;

            // if (this.state.loading || !Object.keys(this.state.vinData).length) return null;
            if (this.state.loading || !this.state.vinData.results) return null;
            else return <ul className="decoder__data-list">
                {this.state.vinData.results.map((elem, index) => {
                    return <li className="decoder__data-item" key={index + searchedVin}>
                        <div className="decoder__title">{elem.Variable + ':'}</div>
                        <div className="decoder__description">{elem.Value}</div>
                    </li>
                })}
            </ul>
        };

        return <section className="decoder section">
            <div className="decoder__head">

                <div className='decoder__input-wrapper'>
                    <input
                        className="decoder__input"
                        placeholder="type vin to decode"
                        onChange={ (e) => this.setState({ vinInputValue: e.target.value }) }
                        type="text"/>
                    <button className="decoder__request-btn"
                            onClick={ () => this.getVinData() }>
                        {this.state.loading ? "loading" : "Send request"}
                    </button>
                </div>

                <MsgFromRequest/>

            </div>

            <RecentlyViewedVinCodes/>

            <VinCodeDataList/>

            {/*{!Object.keys(this.state.vinData).length ?*/}
            { !this.state.vinData.results || this.state.loading ?
                null :
                <button className="decoder__clear-btn"
                        onClick={() => this.setState( { vinData: {}} )}>
                    clear
                </button>}

        </section>
    }
}

export default Decoder;
