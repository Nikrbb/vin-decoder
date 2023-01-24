import SingleVariable from "../components/SingleVariable/SingleVariable";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const VariablePage = () => {
    const navFunc = useNavigate()
    const { slug } = useParams();
    return <SingleVariable navigate={navFunc} id={slug} />
}
export default VariablePage;
