import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Avatar, Card, Divider, List } from "antd";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const showUsers = () => {
    return (
      <Card
        bordered
        style={{ width: "max-content", minWidth: "100%", overflow: "auto"}}
      >
        <Divider orientation="left">Usuários registrados</Divider>
        <br />
        <List
          itemLayout={"horizontal"}
          size={"small"}
          bordered
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              actions={[<NavLink to={`update/${user.id}`}>Editar</NavLink>]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  />
                }
                title={user.name}
                description={user.email}
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  useEffect(() => {
    getUsers();
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {users && !error && showUsers()}
    </>
  );
};

export default Users;
