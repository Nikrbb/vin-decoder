import "./variables-list.scss"
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class VariablesList extends React.Component {
    state = {
        loading: true,
        element: null,
        variablesData: {}
    };

    componentDidMount() {
        if (!localStorage.getItem('allVariables')) {
            axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json")
                .then(response => {

                    const responseData = {
                        message: response.data.Message,
                        variables: response.data.Results
                    };

                    localStorage.setItem('allVariables', JSON.stringify(responseData));
                    this.setState({ variablesData: responseData, loading: false });

                }).catch(error => console.log(error));
        } else {

            const allVariables = JSON.parse(localStorage.getItem('allVariables'));
            this.setState({ variablesData: allVariables, loading: false });
        }
    };

    render() {
        const TableBody = () => {
            return (
                <tbody className="variables__body">
                {
                    this.state.variablesData.variables.map((el) => {
                        return (
                            <tr className="variables__row" key={ el.ID }>
                                <td className="variables__data variables__data--id"><Link to={`/variables/${el.ID}`}>{ el.ID }</Link></td>
                                <td className="variables__data variables__data--name">{ el.Name }</td>
                                <td className="variables__data variables__data--description" dangerouslySetInnerHTML={{__html: el.Description}}/>
                            </tr>
                        )
                    })
                }
                </tbody>
            )
        }

        return <>
             <section className="variables section">
                 <div className="variables__message" >
                     <p>to open a specific variable, click on its id</p>
                     <p style={{color: "green"}}>{this.state.variablesData.message}</p>
                 </div>
                 <div className="variables__table-wrapper">
                     { this.state.loading ? <span className="loading"/> :
                         <table className="variables__table">
                            <thead className="variables__head">
                                <tr className="variables__row">
                                    <th className="variables__title">ID</th>
                                    <th className="variables__title">Name</th>
                                    <th className="variables__title">Description</th>
                                </tr>
                            </thead>

                            <TableBody/>

                        </table>
                     }
                 </div>
            </section>
        </>
    }
}

export default VariablesList;
