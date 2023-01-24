import "./single-variable.scss"
import React from "react"
import axios from "axios";

class SingleVariable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentVariable: {},
            loading: true,
        }
    }
    componentDidMount() {
            axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json")
                .then(response => {
                    const definiteData = response.data.Results.find(el => el.ID === +this.props.id);

                    if (definiteData) {
                        this.setState({currentVariable: definiteData, loading: false} )
                    } else {
                        this.props.navigate('404');
                    }
                })
    }

    render() {
        return <>
                <section className="var section">
                    {this.state.loading ? <span className="loading"/> : <>

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
                </section>
        </>
    }
}

export default SingleVariable
