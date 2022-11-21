import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Paper,
  PasswordInput,
  SegmentedControl,
  Space,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { upperFirst } from "@mantine/hooks";
import DataTable, { TableColumn } from "react-data-table-component";
import { IconArrowDown, IconEdit, IconTrash } from "@tabler/icons";
import {
  IDispatchResponse,
  IPatchUserAPIProps,
  IRegisterAPIProps,
  IUser,
} from "../../utils/types";

import { tableCustomStyles, useStyles } from "./TableStyles";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import {
  addUser,
  deleteUserById,
  fetchAllUsers,
  updateUserById,
} from "../../features/user/userSlice";
import { isNotEmpty, isValidEmail, isValidName } from "../../utils/helpers";

const TableUsers = () => {
  const { users, isLoading } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByName, setFilterByName] = useState<string>("");

  // Modal Open/Close states
  const [addUserModal, setAddUserModal] = useState<boolean>(false);
  const [updateUserModal, setUpdateUserModal] = useState<boolean>(false);
  const [deleteUserModal, setDeleteUserModal] = useState<boolean>(false);

  // User states for adding, updating, deleting
  const [newUser, setNewUser] = useState<IRegisterAPIProps>(
    {} as IRegisterAPIProps
  );
  const [selectedUserData, setSelectedUserData] = useState<IUser>({} as IUser);
  const [userIdToDelete, setUserIdToDelete] = useState<string>("");

  // Fetch all users
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users state by searched first or last name values inside table
  const filteredItems: IUser[] = useMemo(
    () =>
      users?.filter(
        (item) =>
          item.firstName.toLowerCase().includes(filterByName.toLowerCase()) ||
          item.lastName.toLowerCase().includes(filterByName.toLowerCase())
      ),
    [users, filterByName]
  );

  // Add User Action (POST request)
  const handleAddUser = useCallback(async () => {
    try {
      // Validate input fields
      isValidName(newUser.firstName, "first");
      isValidName(newUser.lastName, "last");
      isValidEmail(newUser.email);
      isNotEmpty(newUser.password, "password");
      if (newUser.password.length < 8)
        throw new Error("Password must be of length 8");

      const res: IDispatchResponse = await dispatch(addUser(newUser));
      if (!res.error) {
        setAddUserModal(false);
        setNewUser({} as IRegisterAPIProps);
      }
    } catch (error: any) {
      showNotification({
        title: "Adding user failed. See message below for more info.",
        message: error.message,
        autoClose: 3000,
        color: "yellow",
      });
    }
  }, [dispatch, newUser]);

  // Open update modal and set current row item data to selectedUserData state
  const updateUserAction = useCallback((userRowData: IUser) => {
    setUpdateUserModal(true);
    setSelectedUserData(userRowData);
  }, []);
  // Update User Action (PATCH request)
  const handleUserUpdate = useCallback(async () => {
    try {
      isValidName(selectedUserData.firstName, "first");
      isValidName(selectedUserData.lastName, "last");
      isValidEmail(selectedUserData.email);
      const isTrueSet = selectedUserData.isActivated.toString() === "true";
      const updateUserData: IPatchUserAPIProps = {
        id: selectedUserData.id,
        firstName: selectedUserData?.firstName?.trim(),
        lastName: selectedUserData?.lastName?.trim(),
        email: selectedUserData?.email?.trim(),
        role: selectedUserData.role,
        isActivated: isTrueSet,
      };
      const res: IDispatchResponse = await dispatch(
        updateUserById(updateUserData)
      );
      if (!res.error) {
        setUpdateUserModal(false);
      }
    } catch (error: any) {
      showNotification({
        title: "Updating user failed. See message below for more info.",
        message: error.message,
        autoClose: 3000,
        color: "yellow",
      });
    }
  }, [
    dispatch,
    selectedUserData.id,
    selectedUserData.firstName,
    selectedUserData.lastName,
    selectedUserData.email,
    selectedUserData.isActivated,
    selectedUserData.role,
  ]);

  // Open delete modal and set current row item id to userIdToDelete state
  const handleUserDeleteActionClick = useCallback((id: string) => {
    setUserIdToDelete(id);
    setDeleteUserModal(true);
  }, []);
  // Delete User Action (DELETE request)
  const handleUserDelete = useCallback(() => {
    dispatch(deleteUserById(userIdToDelete));
    setDeleteUserModal(false);
  }, [dispatch, userIdToDelete]);

  // User Table Columns
  const usersColumns: TableColumn<IUser>[] = [
    {
      name: "First Name",
      selector: (row) => upperFirst(row.firstName),
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => upperFirst(row.lastName),
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
      selector: (row) => upperFirst(row.role),
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
              onClick={() => updateUserAction(row)}
              data-testid="rowUpdateUserBtn"
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
              data-testid="rowDeleteUserBtn"
            >
              <IconTrash size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
        </>
      ),
      button: true,
    },
  ];

  return (
    <Paper className={classes.paper}>
      <Group position="apart" className={classes.head}>
        <TextInput
          placeholder="Search user name"
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
          withAsterisk
        />
        <TextInput
          placeholder="Last Name"
          label="Last Name"
          defaultValue={newUser?.lastName}
          onChange={(e) =>
            setNewUser({ ...newUser, lastName: e.currentTarget.value })
          }
          withAsterisk
        />
        <TextInput
          placeholder="juandelacruz@gmail.com"
          label="Email"
          defaultValue={newUser?.email}
          onChange={(e) =>
            setNewUser({ ...newUser, email: e.currentTarget.value })
          }
          withAsterisk
        />
        <PasswordInput
          placeholder="password143"
          label="Password"
          defaultValue={newUser?.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.currentTarget.value })
          }
          withAsterisk
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
        opened={updateUserModal}
        onClose={() => setUpdateUserModal(false)}
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
          withAsterisk
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
          withAsterisk
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
          withAsterisk
        />

        <SegmentedControl
          value={selectedUserData?.isActivated?.toString()}
          mt="15px"
          onChange={(value) =>
            setSelectedUserData({
              ...selectedUserData,
              isActivated: value,
            })
          }
          data={[
            { label: "Status", value: "status", disabled: true },
            { label: "Activate", value: "true" },
            { label: "Deactivate", value: "false" },
          ]}
        />

        <SegmentedControl
          defaultValue={selectedUserData?.role}
          mt="15px"
          onChange={(value) =>
            setSelectedUserData({
              ...selectedUserData,
              role: value,
            })
          }
          data={[
            { label: "Role", value: "role", disabled: true },
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ]}
        />

        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleUserUpdate}
        >
          Update User
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
