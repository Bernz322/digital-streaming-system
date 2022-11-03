import {
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import DataTable, { TableColumn } from "react-data-table-component";
import { IconArrowDown, IconEdit, IconTrash } from "@tabler/icons";
import { IRegisterAPIProps, IUser } from "../../utils/types";
import { useEffect, useState } from "react";
import { tableCustomStyles, useStyles } from "./TableStyles";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import { fetchAllUsers } from "../../features/user/userSlice";
import { isValidEmail, isValidName } from "../../utils/helpers";
import { showNotification } from "@mantine/notifications";

const TableUsers = () => {
  const { users, isLoading } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByName, setFilterByName] = useState<string>("");

  // Modal Open/Close states
  const [addUserModal, setAddUserModal] = useState<boolean>(false);
  const [editUserModal, setEditUserModal] = useState<boolean>(false);
  const [deleteUserModal, setDeleteUserModal] = useState<boolean>(false);

  // User states for adding, updating, deleting
  const [newUser, setNewUser] = useState<IRegisterAPIProps>(
    {} as IRegisterAPIProps
  );
  const [selectedUserData, setSelectedUserData] = useState<IUser>({} as IUser);
  const [userIdToDelete, setUserIdToDelete] = useState<string>("");

  // Add User Action
  const handleAddUser = () => {
    try {
      isValidName(newUser.firstName, "first");
      isValidName(newUser.lastName, "last");
      isValidEmail(newUser.email);
      if (newUser.password === "" || !newUser.password)
        throw new Error("Enter password.");
      console.log(newUser);
      // dispatch(addUser(newUserData));
      setAddUserModal(false);
      setNewUser({} as IRegisterAPIProps);
    } catch (error: any) {
      showNotification({
        title: "Something went wrong.",
        message: error.message,
        autoClose: 5000,
        color: "red",
      });
    }
  };

  // Update  User Action
  const handleUserUpdateActionClick = (userRowData: IUser) => {
    setEditUserModal(true);
    setSelectedUserData(userRowData);
  };
  const handleUserUpdate = () => {
    try {
      isValidName(selectedUserData.firstName, "first");
      isValidName(selectedUserData.lastName, "last");
      isValidEmail(selectedUserData.email);
      const updateUserData = {
        firstName: selectedUserData.firstName,
        lastName: selectedUserData.lastName,
        email: selectedUserData.email,
        role: selectedUserData.role,
        isActivated: selectedUserData.isActivated,
      };
      console.log(updateUserData);
      // dispatch(updateUser(updateUserData));
      setEditUserModal(false);
    } catch (error: any) {
      showNotification({
        title: "Something went wrong.",
        message: error.message,
        autoClose: 5000,
        color: "red",
      });
    }
  };

  // Delete User Action
  const handleUserDeleteActionClick = (id: string) => {
    setUserIdToDelete(id);
    setDeleteUserModal(true);
  };
  const handleUserDelete = () => {
    // dispatch(deleteUser(userIdToDelete))
    console.log(userIdToDelete);
    setDeleteUserModal(false);
  };

  // User Table Columns
  const usersColumns: TableColumn<IUser>[] = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      compact: true,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.isActivated ? "Activated" : "Not activated"),
      compact: true,
      sortable: true,
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => (
        <>
          <Tooltip label="Edit User" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="blue"
              onClick={() => handleUserUpdateActionClick(row)}
            >
              <IconEdit size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete User" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="red"
              onClick={() => handleUserDeleteActionClick(row.id)}
            >
              <IconTrash size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
        </>
      ),
      button: true,
    },
  ];

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredItems = users?.filter(
    (item) =>
      item.firstName.toLowerCase().includes(filterByName.toLowerCase()) ||
      item.lastName.toLowerCase().includes(filterByName.toLowerCase())
  );
  return (
    <Paper className={classes.paper}>
      <Group position="apart" className={classes.head}>
        <TextInput
          placeholder="Search User name"
          classNames={classes}
          value={filterByName}
          onChange={(event) => setFilterByName(event.currentTarget.value)}
        />
        <Button radius="sm" color="blue" onClick={() => setAddUserModal(true)}>
          Add User
        </Button>
      </Group>

      <Space h="md" />

      <DataTable
        title="Users List"
        columns={usersColumns}
        data={filteredItems}
        pagination
        dense
        progressPending={isLoading}
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
      />

      {/* Add User Modals */}
      <Modal
        opened={addUserModal}
        onClose={() => setAddUserModal(false)}
        title="Add User"
        centered
      >
        <TextInput
          placeholder="First Name"
          label="First Name"
          defaultValue={newUser?.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.currentTarget.value })
          }
        />
        <TextInput
          placeholder="Last Name"
          label="Name"
          defaultValue={newUser?.lastName}
          onChange={(e) =>
            setNewUser({ ...newUser, lastName: e.currentTarget.value })
          }
        />
        <TextInput
          placeholder="juandelacruz@gmail.com"
          label="Email"
          defaultValue={newUser?.email}
          onChange={(e) =>
            setNewUser({ ...newUser, email: e.currentTarget.value })
          }
        />
        <PasswordInput
          placeholder="password143"
          label="Password"
          defaultValue={newUser?.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.currentTarget.value })
          }
          autoComplete="new-password"
        />

        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        opened={editUserModal}
        onClose={() => setEditUserModal(false)}
        title="Update user"
        centered
      >
        <TextInput
          label="First Name"
          placeholder={selectedUserData?.firstName}
          value={selectedUserData?.firstName}
          onChange={(e) =>
            setSelectedUserData({
              ...selectedUserData,
              firstName: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Last Name"
          placeholder={selectedUserData?.lastName}
          value={selectedUserData?.lastName}
          onChange={(e) =>
            setSelectedUserData({
              ...selectedUserData,
              lastName: e.currentTarget.value,
            })
          }
        />
        <TextInput
          label="Email"
          placeholder={selectedUserData?.email}
          value={selectedUserData?.email}
          onChange={(e) =>
            setSelectedUserData({
              ...selectedUserData,
              email: e.currentTarget.value,
            })
          }
        />
        <Checkbox
          mt="md"
          checked={selectedUserData?.isActivated}
          label="Activated"
          onChange={(e) =>
            setSelectedUserData({
              ...selectedUserData,
              isActivated: e.currentTarget.checked,
            })
          }
        />
        <Checkbox
          mt="md"
          checked={selectedUserData?.role === "admin" ? true : false}
          label="Admin"
          onChange={(e) =>
            setSelectedUserData({
              ...selectedUserData,
              role: e.currentTarget.checked ? "admin" : "user",
            })
          }
        />

        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleUserUpdate}
        >
          Update
        </Button>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        opened={deleteUserModal}
        onClose={() => setDeleteUserModal(false)}
        title="Are you sure to delete this account?"
        centered
      >
        <Text align="center" color="yellow" size="sm">
          This cannot be undone. Careful.
        </Text>
        <Group position="apart" mt="md">
          <Button
            radius="md"
            className={classes.btn}
            color="red"
            onClick={() => handleUserDelete()}
          >
            Yes
          </Button>
          <Button
            radius="md"
            className={classes.btn}
            color="blue"
            onClick={() => setDeleteUserModal(false)}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default TableUsers;
