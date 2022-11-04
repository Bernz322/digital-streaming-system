import { useCallback, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Text,
  Tooltip,
} from "@mantine/core";
import DataTable, { TableColumn } from "react-data-table-component";
import { IconArrowDown, IconEdit, IconTrash, IconEye } from "@tabler/icons";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import {
  IDispatchResponse,
  IMovieReview,
  IPatchReviewProps,
} from "../../utils/types";
import { useStyles, tableCustomStyles } from "./TableStyles";
import { upperFirst } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  deleteMovieReviewById,
  updateMovieReviewById,
  fetchAllMovies,
} from "../../features/movie/movieSlice";
import dayjs from "dayjs";

const TableReviews = () => {
  const { selectedMovieReviews } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();
  const { classes } = useStyles();

  // Modal Open/Close states
  const [viewReviewModal, setViewReviewModal] = useState<boolean>(false);
  const [editReviewModal, setEditReviewModal] = useState<boolean>(false);
  const [deleteReviewModal, setDeleteReviewModal] = useState<boolean>(false);

  // Movie states for updating, deleting
  const [viewReviewData, setViewReviewData] = useState<IMovieReview>(
    {} as IMovieReview
  );
  const [selectedReviewData, setSelectedReviewData] =
    useState<IPatchReviewProps>({} as IPatchReviewProps);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string>("");

  // View Review Action
  const handleViewReviewActionClick = useCallback((review: IMovieReview) => {
    setViewReviewModal(true);
    setViewReviewData(review);
  }, []);

  // Update  Review Action
  const handleReviewUpdateActionClick = useCallback(
    (movieRowData: IPatchReviewProps) => {
      setEditReviewModal(true);
      setSelectedReviewData(movieRowData);
    },
    []
  );
  const handleReviewUpdate = async () => {
    try {
      const isTrueSet = selectedReviewData.isApproved === "true";
      const updateReviewData: IPatchReviewProps = {
        id: selectedReviewData.id,
        isApproved: isTrueSet,
      };
      const res: IDispatchResponse = await dispatch(
        updateMovieReviewById(updateReviewData)
      );
      await dispatch(fetchAllMovies());
      if (!res.error) {
        setEditReviewModal(false);
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

  // Delete Review Action
  const handleReviewDeleteActionClick = useCallback((id: string) => {
    setReviewIdToDelete(id);
    setDeleteReviewModal(true);
  }, []);
  const handleReviewDelete = async () => {
    dispatch(deleteMovieReviewById(reviewIdToDelete));
    await dispatch(fetchAllMovies());
    setDeleteReviewModal(false);
  };

  // Review Table Columns
  const reviewsColumns: TableColumn<IMovieReview>[] = [
    {
      name: "Comment",
      selector: (row) => upperFirst(row.description),
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
    },
    {
      name: "Date Posted",
      selector: (row) => dayjs(row.datePosted).format("DD-MMM-YYYY"),
      compact: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.isApproved ? "Approved" : "Not approved"),
      sortable: true,
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => (
        <>
          <Tooltip label="View Review" withArrow radius="md">
            <Button
              radius="md"
              size="xs"
              color="green"
              onClick={() => handleViewReviewActionClick(row)}
            >
              <IconEye size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Edit Review" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="blue"
              onClick={() => handleReviewUpdateActionClick(row)}
            >
              <IconEdit size={14} strokeWidth={2} />
            </Button>
          </Tooltip>
          <Tooltip label="Delete Review" withArrow radius="md">
            <Button
              radius="md"
              ml="sm"
              size="xs"
              color="red"
              onClick={() => handleReviewDeleteActionClick(row.id)}
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
      <DataTable
        title="Your selected movie reviews"
        columns={reviewsColumns}
        data={selectedMovieReviews}
        pagination
        dense
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
        fixedHeader={true}
        fixedHeaderScrollHeight="250px"
      />

      {/* View Review Modal */}

      <Modal
        opened={viewReviewModal}
        onClose={() => setViewReviewModal(false)}
        title="Viewing a movie review"
        centered
      >
        <div className="flexCenterStart">
          <Text className={classes.txt} mr="sm">
            From:
          </Text>
          <Text className={classes.txt} weight={500}>
            {`${upperFirst(
              viewReviewData.userReviewer?.firstName as string
            )} ${upperFirst(viewReviewData.userReviewer?.lastName as string)}`}
          </Text>
        </div>
        <div className="flexCenterStart">
          <Text className={classes.txt} mr="sm">
            Review:
          </Text>
          <Text className={classes.txt} weight={500}>
            {viewReviewData.description}
          </Text>
        </div>
        <div className="flexCenterStart">
          <Text className={classes.txt} mr="sm">
            Rated:
          </Text>
          <Text className={classes.txt} weight={500}>
            {viewReviewData.rating} / 5⭐
          </Text>
        </div>
        <div className="flexCenterStart">
          <Text className={classes.txt} mr="sm">
            Posted on:
          </Text>
          <Text className={classes.txt} weight={500}>
            {dayjs(viewReviewData.datePosted).format("DD-MMM-YYYY-h:mm: A")}
          </Text>
        </div>
        <div className="flexCenterStart">
          <Text className={classes.txt} mr="sm">
            Current Status:
          </Text>
          <Text className={classes.txt} weight={500}>
            {viewReviewData.isApproved ? "Approved" : "Not approved"}
          </Text>
        </div>
      </Modal>

      {/* Edit Review Modal */}
      <Modal
        opened={editReviewModal}
        onClose={() => setEditReviewModal(false)}
        title="Update Movie Review"
        centered
      >
        <SegmentedControl
          defaultValue={selectedReviewData?.isApproved?.toString()}
          mt="15px"
          onChange={(value) =>
            setSelectedReviewData({
              ...selectedReviewData,
              isApproved: value,
            })
          }
          data={[
            { label: "Status", value: "approval", disabled: true },
            { label: "Approve", value: "true" },
            { label: "Disapprove", value: "false" },
          ]}
        />
        <Button
          className={classes.btn}
          size="xs"
          mt="lg"
          onClick={handleReviewUpdate}
        >
          Update
        </Button>
      </Modal>

      {/* Delete Review Modal */}
      <Modal
        opened={deleteReviewModal}
        onClose={() => setDeleteReviewModal(false)}
        title="Are you sure to delete this movie review?"
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
            onClick={() => handleReviewDelete()}
          >
            Yes
          </Button>
          <Button
            radius="md"
            className={classes.btn}
            color="blue"
            onClick={() => setDeleteReviewModal(false)}
          >
            No
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default TableReviews;
