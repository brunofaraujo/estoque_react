import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const ItemPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const handleGoback = () => {
        return navigate("/")
    }
    return ( <>
    <h3>Information about item {id}</h3>
    <Button type="link" onClick={handleGoback}>Go back</Button>
    </> );
}
 
export default ItemPage;