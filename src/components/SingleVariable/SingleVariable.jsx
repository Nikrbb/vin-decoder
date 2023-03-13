import "./single-variable.scss";
import React from "react";
import axios from "axios";
import Placeholder from "@avtopro/placeholder/dist/index";
import PlaceholderRobot from '@avtopro/placeholder-robot/dist/index';

class SingleVariable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentVariable: {},
            status: "loading",
        }
    }
    componentDidMount() {
            axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json")
                .then(response => {
                    const definiteData = response.data.Results.find(el => el.ID === +this.props.id);
                    if (definiteData) {
                        this.setState({currentVariable: definiteData, status: 'loaded'} )
                    } else {
                        // this.props.navigate('404');
                        this.setState({status: 'no-data'} )
                    }
                })
    }

    render() {
        const PageStatus = () => {
            if (this.state.status === "no-data") {
                return (
                <Placeholder title="Внимание, данных либо нет, либо они потерялись по пути">
                    <PlaceholderRobot />
                </Placeholder>
                )
            } else if ( this.state.status === "loading") {
                return <span className="loading"/>
            } else if (this.state.status === "loaded") {
                return <>
                <h3 className="var__title">Full description of variable ID: {this.state.currentVariable.ID}</h3>
    
                <ul className="var__list">
                    <li className="var__item var__item--name">
                        <span>Name</span>
                        <p>{this.state.currentVariable.Name}</p>
                    </li>
                    <li className="var__item var__item--type">
                        <span>Data Type</span>
                        <p>{this.state.currentVariable.DataType}</p>
                    </li>
                    <li className="var__item var__item--group">
                        <span>Group Name</span>
                        <p>{this.state.currentVariable.GroupName}</p>
                    </li>
                    <li className="var__item var__item--description">
                        <span>Description</span>
                        <div dangerouslySetInnerHTML={{__html: this.state.currentVariable.Description}}/>
                    </li>
                </ul>
            </>
            }
        }
        
        return <>
        
                <section className="var section">
                    <PageStatus></PageStatus>
                </section>
        </>
    }
}

export default SingleVariable
