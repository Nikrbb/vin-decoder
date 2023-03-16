import './decoder.scss'
import axios from 'axios';
import Button from "@avtopro/button/dist/index"
import Select, { Option } from "@avtopro/select/dist/index";
import Modal from "@avtopro/modal/dist/index";
import TextInput from "@avtopro/text-input/dist/index";
import PlaceholderRobot from '@avtopro/placeholder-robot/dist/index';
import RobotPreloader from '@avtopro/preloader/dist/index';
import FormFrame from '@avtopro/form-frame/dist/index';
import FormControl from '@avtopro/form-control/dist/index';
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
        let lastSeenVin = JSON.parse(localStorage.getItem('lastSeenVin'));
        
        if (viewedList) setRecentlyViewedList(viewedList);
        if (lastSeenVin) setVinData(lastSeenVin)
        
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
                localStorage.setItem("lastSeenVin", JSON.stringify(vinResponse));

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
    const deleteData = () => {
        setVinData({}); 
        toggleModal(!isShownModal);
        localStorage.removeItem("lastSeenVin");
    }
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
            return ( recentlyViewedList[0] ?
                <div className="decoder__viewed">
                    <Select 
                        onChange={(_, vin) => getVinData(vin[0])} 
                        value={latestSearch}
                        placeholder="Recently viewed"
                        blockSize="sm"
                        >
                            {recentlyViewedList.map(vin => 
                            <Option value={vin} key={vin}>{vin}</Option>
                            )}
                    </Select>
                     
                </div> : null
            )
    };
    function VinCodeDataList () {
        const { searchedVin } = vinData;

        if (!loading && !vinData.results) return null
        else  if (loading || !vinData.results) return <RobotPreloader fixed/>;
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
                    <FormFrame>
                        <FormControl label="Vin code" htmlFor="vinCode">
                            <TextInput onChange={ (e) => setInputValue( e.target.value ) } id="vinCode" blockSize="sm" name="vin" placeholder="Type vin to decode" />
                        </FormControl>
                    </FormFrame>
                    <Button 
                        uppercase
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
                <Button blockSize="sm" theme="youtube" uppercase className="decoder__clear-btn"
                        onClick={() => toggleModal(true)}>
                    clear
                </Button> }


            { isShownModal
            ?   <Modal closeOnClick size="wide" onClose={() => {toggleModal(!isShownModal) }}>

                    <div className="modwin__caption">Confirm action</div>
                    <div className="modwin__sub-caption">Are you sure you want to clear vehicle data?</div>
                    <PlaceholderRobot />
                    <div className='text-center'>
                        <Button onClick={() => deleteData()} uppercase theme="youtube" blockSize="sm">delete</Button>
                    </div>

                </Modal> 
            : null }



        </section>
}

export default Decoder