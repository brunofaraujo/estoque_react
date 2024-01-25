import { Link } from "react-router-dom";

const ItemsPage = () => {
  return (
    <>
      <h3>List of items here...</h3>
      <ul>
        <li>
          <Link to="/item/1">Item 1</Link>
        </li>
        <li>
          <Link to="/item/2">Item 2</Link>
        </li>
        <li>
          <Link to="/item/3">Item 3</Link>
        </li>
        <li>
          <Link to="/item/4">Item 4</Link>
        </li>
      </ul>
    </>
  );
};

export default ItemsPage;
