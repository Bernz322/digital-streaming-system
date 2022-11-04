import {
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  SegmentedControl,
  Space,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import DataTable, { TableColumn } from "react-data-table-component";
import { IconArrowDown, IconEdit, IconTrash, IconEye } from "@tabler/icons";
import { useCallback, useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { upperFirst } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  addActor,
  deleteActorById,
  fetchAllActors,
  updateActorById,
} from "../../features/actor/actorSlice";
import { IActor, IDispatchResponse, IPostActor } from "../../utils/types";
import { tableCustomStyles, useStyles } from "./TableStyles";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import { isValidName, isValidUrl } from "../../utils/helpers";

const TableActors = () => {
  const { actors } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByName, setFilterByName] = useState<string>("");

  // Modal Open/Close states
  const [addActorModal, setAddActorModal] = useState<boolean>(false);
  const [editActorModal, setEditActorModal] = useState<boolean>(false);
  const [deleteActorModal, setDeleteActorModal] = useState<boolean>(false);

  // Actor states for adding, updating, deleting
  const [newActor, setNewActor] = useState<IPostActor>({
    firstName: "",
    lastName: "",
    gender: "male",
    age: 0,
    image: "",
    link: "",
  });
  const [selectedActorData, setSelectedActorData] = useState<IActor>(
    {} as IActor
  );
  const [actorIdToDelete, setActorIdToDelete] = useState<string>("");

  // Add Actor Action
  const handleAddActor = async () => {
    try {
      isValidName(newActor.firstName, "first");
      isValidName(newActor.lastName, "last");
      if (newActor.gender !== "male" && newActor.gender !== "female")
        throw new Error("Gender should only be either male or female");
      if (newActor.age < 1 || !newActor.age)
        throw new Error("Actor age cannot be less than a year.");
      isValidUrl(newActor.image, "actor image");
      isValidUrl(newActor.link as string, "actor link");
      const res: IDispatchResponse = await dispatch(addActor(newActor));
      if (!res.error) {
        setAddActorModal(false);
        setNewActor({
          firstName: "",
          lastName: "",
          gender: "male",
          age: 0,
          image: "",
          link: "",
        });
      }
    } catch (error: any) {
      showNotification({
        title: "Something went wrong.",
        message: error.message,
        autoClose: 5000,
        color: "red",
      });
    }
  };

  // Update  Actor Action
  const handleActorUpdateActionClick = useCallback((actorRowData: IActor) => {
    setEditActorModal(true);
    setSelectedActorData(actorRowData);
  }, []);
  const handleActorUpdate = async () => {
    try {
      isValidName(selectedActorData.firstName, "first");
      isValidName(selectedActorData.lastName, "last");
      if (
        selectedActorData.gender !== "male" &&
        selectedActorData.gender !== "female"
      )
        throw new Error("Gender should only be either male or female");
      if (selectedActorData.age < 1 || !selectedActorData.age)
        throw new Error("Actor age cannot be less than a year.");
      isValidUrl(selectedActorData.image, "actor image");
      isValidUrl(selectedActorData.link as string, "actor link");
      const updateActorData: IPostActor = {
        id: selectedActorData.id,
        firstName: selectedActorData.firstName,
        lastName: selectedActorData.lastName,
        gender: selectedActorData.gender,
        age: selectedActorData.age,
        image: selectedActorData.image,
        link: selectedActorData.link,
      };

      const res: IDispatchResponse = await dispatch(
        updateActorById(updateActorData)
      );
      if (!res.error) {
        setEditActorModal(false);
      }
    } catch (error: any) {
      showNotification({
        title: "Something went wrong.",
        message: error.message,
        autoClose: 5000,
        color: "red",
      });
    }
  };

  // Delete Actor Action
  const handleActorDeleteActionClick = useCallback((id: string) => {
    setActorIdToDelete(id);
    setDeleteActorModal(true);
  }, []);

  const handleActorDelete = () => {
    dispatch(deleteActorById(actorIdToDelete));
    setDeleteActorModal(false);
  };

  // Actor Table Columns
  const actorsColumns: TableColumn<IActor>[] = [
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
      name: "Gender",
      selector: (row) => upperFirst(row.gender),
      compact: true,
      sortable: true,
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true,
    },
    {
      name: "Link",
      cell: (row) =>
        row.link ? (
          <a href={row.link} target="_blank" rel="noreferrer">
            More
          </a>
        ) : (
          "No link"
        ),
      sortable: true,
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => (
        <>
          <Tooltip label="View Actor" withArrow radius="md">
            <Button
              radius="md"
              size="xs"
              color="green"
              onClick={() => navigate(`/actor/${row.id}`)}
            >
              <IconEye size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Edit Actor" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="blue"
              onClick={() => handleActorUpdateActionClick(row)}
            >
              <IconEdit size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete Actor" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="red"
              onClick={() => handleActorDeleteActionClick(row.id)}
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
    dispatch(fetchAllActors());
  }, [dispatch]);

  const filteredItems: IActor[] = actors?.filter(
    (item) =>
      item.firstName.toLowerCase().includes(filterByName.toLowerCase()) ||
      item.lastName.toLowerCase().includes(filterByName.toLowerCase())
  );
  return (
    <Paper className={classes.paper}>
      <Group position="apart" className={classes.head}>
        <TextInput
          placeholder="Search actor name"
          classNames={classes}
          value={filterByName}
          onChange={(event) => setFilterByName(event.currentTarget.value)}
        />
        <Button radius="sm" color="blue" onClick={() => setAddActorModal(true)}>
          Add Actor
        </Button>
      </Group>

      <Space h="md" />

      <DataTable
        title="Actors List"
        columns={actorsColumns}
        data={filteredItems}
        pagination
        dense
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
        fixedHeader={true}
        fixedHeaderScrollHeight="250px"
      />

      {/* Add Actor Modals */}
      <Modal
        opened={addActorModal}
        onClose={() => setAddActorModal(false)}
        title="Add Actor"
        centered
      >
        <TextInput
          placeholder="First Name"
          label="First Name"
          defaultValue={newActor?.firstName}
          onChange={(e) =>
            setNewActor({ ...newActor, firstName: e.currentTarget.value })
          }
          withAsterisk
        />
        <TextInput
          placeholder="Last Name"
          label="Last Name"
          defaultValue={newActor?.lastName}
          onChange={(e) =>
            setNewActor({ ...newActor, lastName: e.currentTarget.value })
          }
        />
        <NumberInput
          placeholder="Actor age"
          label="Actor age"
          defaultValue={newActor?.age}
          onChange={(value) =>
            setNewActor({ ...newActor, age: value as number })
          }
          hideControls
        />
        <TextInput
          placeholder="Actor link (e.g. IMDB or Wikipedia)"
          label="Actor Link"
          defaultValue={newActor?.link}
          onChange={(e) =>
            setNewActor({ ...newActor, link: e.currentTarget.value })
          }
        />
        <TextInput
          placeholder="Actor Image URL"
          label="Actor Image"
          defaultValue={newActor?.image}
          onChange={(e) =>
            setNewActor({ ...newActor, image: e.currentTarget.value })
          }
        />

        <SegmentedControl
          defaultValue={newActor?.gender}
          mt="15px"
          onChange={(value) =>
            setNewActor({
              ...newActor,
              gender: value as "male" | "female",
            })
          }
          data={[
            { label: "Gender", value: "gender", disabled: true },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />

        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleAddActor}
        >
          Add Actor
        </Button>
      </Modal>

      {/* Edit Actor Modal */}
      <Modal
        opened={editActorModal}
        onClose={() => setEditActorModal(false)}
        title="Update Actor"
        centered
      >
        <TextInput
          placeholder="First Name"
          label="First Name"
          defaultValue={selectedActorData?.firstName}
          onChange={(e) =>
            setSelectedActorData({
              ...selectedActorData,
              firstName: e.currentTarget.value,
            })
          }
        />
        <TextInput
          placeholder="Last Name"
          label="Name"
          defaultValue={selectedActorData?.lastName}
          onChange={(e) =>
            setSelectedActorData({
              ...selectedActorData,
              lastName: e.currentTarget.value,
            })
          }
        />
        <NumberInput
          placeholder="Actor age"
          label="Actor age"
          defaultValue={selectedActorData?.age}
          onChange={(value) =>
            setSelectedActorData({ ...selectedActorData, age: value as number })
          }
        />
        <TextInput
          placeholder="Actor link (e.g. IMDB or Wikipedia)"
          label="Actor Link"
          defaultValue={selectedActorData?.link}
          onChange={(e) =>
            setSelectedActorData({
              ...selectedActorData,
              link: e.currentTarget.value,
            })
          }
        />
        <TextInput
          placeholder="Actor Image URL"
          label="Actor Image"
          defaultValue={selectedActorData?.image}
          onChange={(e) =>
            setSelectedActorData({
              ...selectedActorData,
              image: e.currentTarget.value,
            })
          }
        />
        <SegmentedControl
          defaultValue={selectedActorData?.gender}
          mt="15px"
          onChange={(value) =>
            setSelectedActorData({
              ...selectedActorData,
              gender: value as "male" | "female",
            })
          }
          data={[
            { label: "Gender", value: "gender", disabled: true },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />

        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleActorUpdate}
        >
          Update
        </Button>
      </Modal>

      {/* Delete Actor Modal */}
      <Modal
        opened={deleteActorModal}
        onClose={() => setDeleteActorModal(false)}
        title="Are you sure to delete this actor?"
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
            onClick={() => handleActorDelete()}
          >
            Yes
          </Button>
          <Button
            radius="md"
            className={classes.btn}
            color="blue"
            onClick={() => setDeleteActorModal(false)}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default TableActors;
