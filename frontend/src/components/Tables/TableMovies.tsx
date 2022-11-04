import {
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  SegmentedControl,
  Space,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import {
  IconArrowDown,
  IconEdit,
  IconTrash,
  IconEye,
  IconMessageDots,
} from "@tabler/icons";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import {
  IDispatchResponse,
  IMovie,
  IMovieReview,
  IPatchMovie,
  IPostActor,
  IPostMovie,
} from "../../utils/types";
import { tableCustomStyles, useStyles } from "./TableStyles";
import {
  addMovie,
  deleteMovieById,
  fetchAllMovies,
  fetchMovieReviewsById,
  updateMovieById,
} from "../../features/movie/movieSlice";
import { showNotification } from "@mantine/notifications";
import {
  budgetFormatter,
  isNotEmpty,
  isValidName,
  isValidUrl,
  movieRating,
} from "../../utils/helpers";
import { addActor } from "../../features/actor/actorSlice";

const TableMovies = () => {
  const { movies, isLoading } = useTypedSelector((state) => state.movie);
  const { actors } = useTypedSelector((state) => state.actor);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByTitle, setFilterByTitle] = useState<string>("");

  // Modal Open/Close states
  const [addMovieModal, setAddMovieModal] = useState<boolean>(false);
  const [addActorModal, setAddActorModal] = useState<boolean>(false);
  const [editMovieModal, setEditMovieModal] = useState<boolean>(false);
  const [deleteMovieModal, setDeleteMovieModal] = useState<boolean>(false);

  // Movie states for adding, updating, deleting
  const [newMovie, setNewMovie] = useState<IPostMovie>({
    title: "",
    description: "",
    cost: 0,
    yearReleased: 2022,
    image: "",
    actors: [],
  });
  const [newActor, setNewActor] = useState<IPostActor>({
    firstName: "",
    lastName: "",
    gender: "male",
    age: 0,
    image: "",
    link: "",
  });
  const [selectedMovieData, setSelectedMovieData] = useState<IPatchMovie>(
    {} as IPatchMovie
  );
  const [movieIdToDelete, setMovieIdToDelete] = useState<string>("");

  // Add Movie Action
  const handleAddMovie = async () => {
    try {
      isNotEmpty(newMovie.title, "movie title");
      isNotEmpty(newMovie.description, "movie description");
      if (newMovie.cost < 0 || !newMovie.cost)
        throw new Error("Movie budget cost cannot be less than 0.");
      if (newMovie.yearReleased < 0 || !newMovie.yearReleased)
        throw new Error("Movie year released cannot be of negative value.");
      isValidUrl(newMovie.image, "movie image");
      if (newMovie.actors.length <= 0 || !newMovie.actors)
        throw new Error("Movie cannot have 0 actor.");
      const res: IDispatchResponse = await dispatch(addMovie(newMovie));
      if (!res.error) {
        setAddMovieModal(false);
        setNewMovie({
          title: "",
          description: "",
          cost: 0,
          yearReleased: 2022,
          image: "",
          actors: [],
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

  // Update Movie Action
  const handleMovieUpdateActionClick = useCallback(
    (movieRowData: IPatchMovie) => {
      setEditMovieModal(true);
      setSelectedMovieData(movieRowData);
    },
    []
  );
  const handleMovieUpdate = async () => {
    try {
      isNotEmpty(selectedMovieData.description, "movie description");
      if (selectedMovieData.cost < 0 || !selectedMovieData.cost)
        throw new Error("Movie budget cost cannot be less than 0.");
      isValidUrl(selectedMovieData.image, "movie image");

      const updateMovieData: IPatchMovie = {
        id: selectedMovieData.id,
        description: selectedMovieData.description,
        cost: selectedMovieData.cost,
        image: selectedMovieData.image,
      };

      const res: IDispatchResponse = await dispatch(
        updateMovieById(updateMovieData)
      );
      if (!res.error) {
        setEditMovieModal(false);
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

  // Delete Movie Action
  const handleMovieDeleteActionClick = useCallback((id: string) => {
    setMovieIdToDelete(id);
    setDeleteMovieModal(true);
  }, []);
  const handleActorDelete = () => {
    dispatch(deleteMovieById(movieIdToDelete));
    setDeleteMovieModal(false);
  };

  // Movie Table Columns
  const moviesColumns: TableColumn<IMovie>[] = [
    {
      name: "Title",
      selector: (row) => upperFirst(row.title),
      sortable: true,
      reorder: true,
    },
    {
      name: "Description",
      selector: (row) => upperFirst(row.description),
      sortable: true,
      reorder: true,
    },
    {
      name: "Rating",
      selector: (row) =>
        `${movieRating(row.movieReviews as IMovieReview[])}/5 ⭐`,
      sortable: true,
      reorder: true,
    },
    {
      name: "Budget Cost",
      selector: (row) => budgetFormatter(row.cost),
      sortable: true,
      reorder: true,
    },
    {
      name: "Year Released",
      selector: (row) => row.yearReleased,
      sortable: true,
      reorder: true,
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => (
        <>
          <Tooltip label="View Movie" withArrow radius="md">
            <Button
              radius="md"
              size="xs"
              color="green"
              onClick={() => navigate(`/movie/${row.id}`)}
            >
              <IconEye size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Manage Reviews" withArrow radius="md">
            <Button
              radius="md"
              ml={5}
              size="xs"
              color="green"
              disabled={isLoading}
              loading={isLoading}
              onClick={() => dispatch(fetchMovieReviewsById(row.id))}
            >
              <IconMessageDots size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Edit Movie" withArrow radius="md">
            <Button
              radius="md"
              ml={5}
              size="xs"
              color="blue"
              onClick={() => handleMovieUpdateActionClick(row)}
            >
              <IconEdit size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete Movie" withArrow radius="md">
            <Button
              radius="md"
              ml={5}
              size="xs"
              color="red"
              onClick={() => handleMovieDeleteActionClick(row.id)}
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
    dispatch(fetchAllMovies());
  }, [dispatch]);

  const actorsList = actors.map((actor) => {
    return { value: actor.id, label: `${actor.firstName} ${actor.lastName}` };
  });

  const filteredItems: IMovie[] = movies?.filter((item) =>
    item.title.toLowerCase().includes(filterByTitle.toLowerCase())
  );
  return (
    <Paper className={classes.paper}>
      <Group position="apart" className={classes.head}>
        <TextInput
          placeholder="Search movie title"
          classNames={classes}
          value={filterByTitle}
          onChange={(event) => setFilterByTitle(event.currentTarget.value)}
        />
        <Button radius="sm" color="blue" onClick={() => setAddMovieModal(true)}>
          Add Movie
        </Button>
      </Group>

      <Space h="md" />

      <DataTable
        title="Movies List"
        columns={moviesColumns}
        data={filteredItems}
        pagination
        dense
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
        fixedHeader={true}
        fixedHeaderScrollHeight="300px"
      />

      {/* Add Movie Modal */}
      <Modal
        opened={addMovieModal}
        onClose={() => setAddMovieModal(false)}
        title="Add Movie"
        centered
      >
        <TextInput
          placeholder="Movie Title"
          label="Movie Title"
          defaultValue={newMovie?.title}
          onChange={(e) =>
            setNewMovie({ ...newMovie, title: e.currentTarget.value })
          }
          withAsterisk
        />
        <Textarea
          label="Movie Description"
          placeholder="Movie Description"
          radius="md"
          autosize
          minRows={2}
          maxRows={4}
          defaultValue={newMovie?.description}
          onChange={(e) =>
            setNewMovie({ ...newMovie, description: e.currentTarget.value })
          }
          withAsterisk
        />
        <NumberInput
          placeholder="Movie Budget Cost"
          label="Movie Budget Cost"
          defaultValue={newMovie?.cost}
          onChange={(value) =>
            setNewMovie({ ...newMovie, cost: value as number })
          }
          hideControls
          withAsterisk
        />
        <NumberInput
          placeholder="Movie Year Released"
          label="Movie Year Released"
          defaultValue={newMovie?.yearReleased}
          onChange={(value) =>
            setNewMovie({ ...newMovie, yearReleased: value as number })
          }
          hideControls
          withAsterisk
        />
        <TextInput
          placeholder="Movie image"
          label="Movie image"
          defaultValue={newMovie?.image}
          onChange={(e) =>
            setNewMovie({ ...newMovie, image: e.currentTarget.value })
          }
          withAsterisk
        />
        <MultiSelect
          data={actorsList}
          label="Pick Actors"
          placeholder="Pick all that are involved in this movie"
          onChange={(value) => setNewMovie({ ...newMovie, actors: value })}
          withAsterisk
        />
        <Button
          className={classes.btn}
          size="xs"
          mt="xs"
          variant="outline"
          color="yellow"
          onClick={() => setAddActorModal(true)}
        >
          Add Actor
        </Button>
        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleAddMovie}
        >
          Add Movie
        </Button>
      </Modal>

      {/* Add Actor Modal */}
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

      {/* Edit Movie Modal */}
      <Modal
        opened={editMovieModal}
        onClose={() => setEditMovieModal(false)}
        title="Add Movie"
        centered
      >
        <Textarea
          label="Movie Description"
          placeholder="Movie Description"
          radius="md"
          autosize
          minRows={2}
          maxRows={4}
          defaultValue={selectedMovieData?.description}
          onChange={(e) =>
            setSelectedMovieData({
              ...selectedMovieData,
              description: e.currentTarget.value,
            })
          }
          withAsterisk
        />
        <NumberInput
          placeholder="Movie Budget Cost"
          label="Movie Budget Cost"
          defaultValue={selectedMovieData?.cost}
          onChange={(value) =>
            setSelectedMovieData({
              ...selectedMovieData,
              cost: value as number,
            })
          }
          hideControls
          withAsterisk
        />
        <TextInput
          placeholder="Movie image"
          label="Movie image"
          defaultValue={selectedMovieData?.image}
          onChange={(e) =>
            setSelectedMovieData({
              ...selectedMovieData,
              image: e.currentTarget.value,
            })
          }
          withAsterisk
        />
        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleMovieUpdate}
        >
          Add Movie
        </Button>
      </Modal>

      {/* Delete Movie Modal */}
      <Modal
        opened={deleteMovieModal}
        onClose={() => setDeleteMovieModal(false)}
        title="Are you sure to delete this movie?"
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
            onClick={() => setDeleteMovieModal(false)}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default TableMovies;
