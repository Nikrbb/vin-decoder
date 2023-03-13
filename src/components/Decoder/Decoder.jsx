import './decoder.scss'
import axios from 'axios';
import Button from "@avtopro/button/dist/index"
import Select, { Option } from "@avtopro/select/dist/index";
import Modal from "@avtopro/modal/dist/index";
import TextInput from "@avtopro/text-input/dist/index";
import PlaceholderRobot from '@avtopro/placeholder-robot/dist/index';
import React, { useState, useEffect } from 'react';

function Decoder() {
    const [latestSearch, setLatestSearch] = useState();
    const [vinInputValue, setInputValue] = useState(null);
    const [recentlyViewedList, setRecentlyViewedList] = useState([]);
    const [vinData, setVinData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isShownModal, toggleModal] = useState(false);

    useEffect(() => {
        let viewedList = JSON.parse(localStorage.getItem('viewedList'));

        setRecentlyViewedList( viewedList ? viewedList : []);
        setLoading(false);
    }, [])

    const getVinData = (vin) => {
        // here we validate input value only if function was called
        // by btn "send request" not by recently viewed item
        if (!vin) if (!validateInput()) return;

        const vinToDecode = vin ? vin : vinInputValue;
        setLoading(true);

        sendRequest(vinToDecode)
    };
    const sendRequest = (vinToDecode) => {
        axios.get( `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${ vinToDecode }?format=json` )
            .then((response) => {

                let vinResponse = {
                    searchedVin: response.data.SearchCriteria,
                    message: response.data.Message,
                    results: response.data.Results.filter(elem => !!elem.Value)
                }
                setVinData(vinResponse);
                if (!recentlyViewedList.includes( vinToDecode )) {

                    let viewedList = [...recentlyViewedList, vinToDecode];
                    if (viewedList.length > 5) viewedList.splice(0, 1);

                    setRecentlyViewedList ( viewedList );
                    
                    localStorage.setItem('viewedList', JSON.stringify(viewedList));

                }
                setLatestSearch( vinToDecode );
                setLoading(false);

            }).catch( error => console.log(error) );
    };
    const validateInput = () => {
        let obj = {};
        if (!vinInputValue) {

            obj.message =  "Vin code can`t be empty";
            setVinData(obj);
            return false;

        } else if (vinInputValue.length > 17) {

            obj.message =  "Vin code can`t have more than 17 characters";
            setVinData(obj);
            return false;
        // eslint-disable-next-line
        } else if ( /^(?=.*[!@#$%^&(),.+=/\/\]\[{}?><":;|])/.test(vinInputValue) ) {

            obj.message =  "Vin code can`t have forbidden characters";
            setVinData(obj);
            return false;

        } else return true;

    };
    function  MsgFromRequest(props)  {
        if (!Object.keys(props.vinData).length) return (
            <div className="decoder__empty-msg">
                <span>Area for message from response</span>
            </div>
        )
        else return <div className="decoder__message">
            <span>response message</span>
            <p >{props.vinData.message}</p>
        </div>
    }
    function RecentlyViewedVinCodes() {
            return (
                <div className="decoder__viewed">
                    <h5>Recently viewed:</h5>

                    <Select 
                        onChange={(_, vin) => getVinData(vin[0])} 
                        value={latestSearch}
                        placeholder={!recentlyViewedList[0] ? "empty" : "select"}
                        blockSize="sm"
                        >
                            {recentlyViewedList.map(vin => 
                            <Option value={vin} key={vin}>{vin}</Option>
                            )}
                    </Select>
                     
                </div>
            )
    };
    function VinCodeDataList () {
        const { searchedVin } = vinData;

        if (loading || !vinData.results) return null;
        else return <ul className="decoder__data-list">
            {vinData.results.map((elem, index) => {
                return <li className="decoder__data-item" key={index + searchedVin}>
                    <div className="decoder__title">{elem.Variable + ':'}</div>
                    <div className="decoder__description">{elem.Value}</div>
                </li>
            })}
        </ul>
    };

    return  <section className="decoder section">
            <div className="decoder__head">

                <div className='decoder__input-wrapper'>
                    <TextInput onChange={ (e) => setInputValue( e.target.value ) } blockSize="sm" placeholder="type vin to decode" />
                    <Button 
                        blockSize="sm" 
                        theme="blue"
                        onClick={ () => getVinData() }>
                    { loading ? "loading" : "Send request"}
                    </Button>
                </div>

                <MsgFromRequest vinData={vinData}/>

            </div>

            
            <RecentlyViewedVinCodes recentlyViewedList={recentlyViewedList}/>

            <VinCodeDataList/>

            { !vinData.results || loading ?
                null :
                <button className="decoder__clear-btn"
                        onClick={() => toggleModal(true)}>
                    clear
                </button> }


            { isShownModal
            ?   <Modal size="wide" onClose={() => {toggleModal(!isShownModal) }}>
                    <div>
                        <p style={{textAlign: "center"}}>Are you sure you want to clear vehicle data?</p>
                        <Button onClick={() => {setVinData({}); toggleModal(!isShownModal)}} style={{position: "absolute", bottom: '10px', right: '10px'}} theme="danger" blockSize="sm">delete</Button>
                        <PlaceholderRobot />
                    </div>
                </Modal> 
            : null }



        </section>
}

export default Decoder