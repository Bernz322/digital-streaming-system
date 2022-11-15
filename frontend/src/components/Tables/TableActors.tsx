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
  deleteActorById,
  fetchAllActors,
  updateActorById,
} from "../../features/actor/actorSlice";
import { IActor, IDispatchResponse, IPostActor } from "../../utils/types";
import { tableCustomStyles, useStyles } from "./TableStyles";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import { isValidName, isValidUrl } from "../../utils/helpers";
import AddActorModal from "../AddActorModal.tsx/AddActorModal";

const TableActors = () => {
  const { actors, isLoading } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByName, setFilterByName] = useState<string>("");

  // Modal Open/Close states
  const [addActorModal, setAddActorModal] = useState<boolean>(false);
  const [updateActorModal, setUpdateActorModal] = useState<boolean>(false);
  const [deleteActorModal, setDeleteActorModal] = useState<boolean>(false);

  const [selectedActorData, setSelectedActorData] = useState<IActor>(
    {} as IActor
  );
  const [actorIdToDelete, setActorIdToDelete] = useState<string>("");

  // Fetch all actors
  useEffect(() => {
    dispatch(fetchAllActors());
  }, [dispatch]);

  // Filter actors state by searched first or last name values inside table
  const filteredItems: IActor[] = actors?.filter(
    (item) =>
      item.firstName.toLowerCase().includes(filterByName.toLowerCase()) ||
      item.lastName.toLowerCase().includes(filterByName.toLowerCase())
  );

  // Open update modal and set current row item data to selectedActorData state
  const handleActorUpdateActionClick = useCallback((actorRowData: IActor) => {
    setUpdateActorModal(true);
    setSelectedActorData(actorRowData);
  }, []);
  // Update  Actor Action (PATCH request)
  const handleActorUpdate = useCallback(async () => {
    try {
      // Validate input fields
      isValidName(selectedActorData.firstName, "first");
      isValidName(selectedActorData.lastName, "last");
      if (selectedActorData.age < 1 || !selectedActorData.age)
        throw new Error("Actor age cannot be less than a year.");
      isValidUrl(selectedActorData.image, "actor image");
      isValidUrl(selectedActorData.link as string, "actor link");

      const updateActorData: IPostActor = {
        id: selectedActorData.id,
        firstName: selectedActorData?.firstName.trim(),
        lastName: selectedActorData?.lastName.trim(),
        gender: selectedActorData.gender,
        age: selectedActorData.age,
        image: selectedActorData?.image.trim(),
        link: selectedActorData?.link?.trim(),
      };

      const res: IDispatchResponse = await dispatch(
        updateActorById(updateActorData)
      );
      if (!res.error) {
        setUpdateActorModal(false);
      }
    } catch (error: any) {
      showNotification({
        title: "Updating actor failed. See message below for more info.",
        message: error.message,
        autoClose: 3000,
        color: "yellow",
      });
    }
  }, [
    dispatch,
    selectedActorData.id,
    selectedActorData.firstName,
    selectedActorData.lastName,
    selectedActorData.gender,
    selectedActorData.age,
    selectedActorData.image,
    selectedActorData.link,
  ]);

  // Open delete modal and set current row item id to actorIdToDelete state
  const handleActorDeleteActionClick = useCallback((id: string) => {
    setActorIdToDelete(id);
    setDeleteActorModal(true);
  }, []);
  // Delete Actor Action (DELETE request)
  const handleActorDelete = useCallback(() => {
    dispatch(deleteActorById(actorIdToDelete));
    setDeleteActorModal(false);
  }, [dispatch, actorIdToDelete]);

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
              data-testid="rowViewActorBtn"
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
              data-testid="rowUpdateActorBtn"
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
              data-testid="rowDeleteActorBtn"
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
        progressPending={isLoading}
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
      />

      {/* Add Actor Modals */}
      <AddActorModal
        addActorModal={addActorModal}
        setAddActorModal={setAddActorModal}
      />

      {/* Edit Actor Modal */}
      <Modal
        opened={updateActorModal}
        onClose={() => setUpdateActorModal(false)}
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
          withAsterisk
        />
        <TextInput
          placeholder="Last Name"
          label="Last Name"
          defaultValue={selectedActorData?.lastName}
          onChange={(e) =>
            setSelectedActorData({
              ...selectedActorData,
              lastName: e.currentTarget.value,
            })
          }
          withAsterisk
        />
        <NumberInput
          placeholder="Actor age"
          label="Actor age"
          defaultValue={selectedActorData?.age}
          onChange={(value) =>
            setSelectedActorData({ ...selectedActorData, age: value as number })
          }
          withAsterisk
          hideControls
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
          withAsterisk
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
          Update Actor
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
