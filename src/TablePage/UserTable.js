import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button, Input } from "antd";
import axios from "axios";

const { Search } = Input;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 5;

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data API:", error);
      });
  }, []);

  const handlePageChangePagination = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter(
    (user) =>
      user.name.firstname.toLowerCase().includes(filter.toLowerCase()) ||
      user.name.lastname.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.phone.toLowerCase().includes(filter.toLowerCase())
  );

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  console.log(currentUsers);
  const handleViewUser = (user) => {
    console.log(user);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "name",
      key: "firstname",
      render: (name) =>
        name.firstname.charAt(0).toUpperCase() + name?.firstname.slice(1),
    },
    {
      title: "Last Name",
      dataIndex: "name",
      key: "lastname",
      render: (name) =>
        name.lastname.charAt(0).toUpperCase() + name?.lastname.slice(1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <Button type="primary" onClick={() => handleViewUser(user)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <h1 className="pb-3">User Data</h1>
      <Search
        placeholder="Filter by name, email, phone..."
        onChange={(e) => handleFilterChange(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={currentUsers} pagination={false} />
      <Pagination
        style={{ marginTop: 16, textAlign: "center" }}
        current={currentPage}
        total={filteredUsers.length}
        pageSize={usersPerPage}
        onChange={handlePageChangePagination}
      />
      {/* ------------------- Modal --------------------- */}
      <Modal
        visible={selectedUser !== null}
        onCancel={handleCloseModal}
        footer={null}
      >
        <h2>User Details</h2>
        {selectedUser && (
          <div>
            <p>
              <strong>First Name: </strong>
              {selectedUser?.name?.firstname?.charAt(0).toUpperCase() +
                selectedUser?.name?.firstname.slice(1)}
            </p>
            <p>
              <strong>Last Name: </strong>
              {selectedUser?.name?.lastname?.charAt(0).toUpperCase() +
                selectedUser?.name?.lastname?.slice(1)}
            </p>
            <p>
              <strong>Email: </strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone: </strong> {selectedUser.phone}
            </p>
          </div>
        )}
      </Modal>
      {/* --------------------------------------------- */}
    </div>
  );
};

export default UserTable;
