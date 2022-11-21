import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Space,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { upperFirst } from "@mantine/hooks";
import DataTable, { TableColumn } from "react-data-table-component";
import { IconArrowDown, IconEdit, IconEye } from "@tabler/icons";
import dayjs from "dayjs";
import { useTypedDispatch, useTypedSelector } from "../../hooks/rtk-hooks";
import {
  IDispatchResponse,
  IMovieReview,
  IPatchReviewProps,
} from "../../utils/types";
import { useStyles, tableCustomStyles } from "./TableStyles";
import {
  updateMovieReviewById,
  fetchUnapprovedMovieReviews,
  fetchApprovedMovieReviews,
  fetchAllMovieReviews,
} from "../../features/movie/movieSlice";

const TableReviews = () => {
  const { reviews } = useTypedSelector((state) => state.movie);
  const dispatch = useTypedDispatch();
  const { classes } = useStyles();

  // Name search filter state
  const [filterByName, setFilterByName] = useState<string>("");

  // Modal Open/Close states
  const [viewReviewModal, setViewReviewModal] = useState<boolean>(false);
  const [editReviewModal, setEditReviewModal] = useState<boolean>(false);

  // Review states for viewing ,updating and deleting
  const [viewReviewData, setViewReviewData] = useState<IMovieReview>(
    {} as IMovieReview
  );
  const [selectedReviewData, setSelectedReviewData] =
    useState<IPatchReviewProps>({} as IPatchReviewProps);

  //Fetch all unapproved reviews
  useEffect(() => {
    dispatch(fetchUnapprovedMovieReviews());
  }, [dispatch]);

  // View Review Action
  const handleViewReviewActionClick = useCallback((review: IMovieReview) => {
    setViewReviewModal(true);
    setViewReviewData(review);
  }, []);

  // Open update modal and set current row item data to selectedReviewData state
  const handleReviewUpdateActionClick = useCallback(
    (movieRowData: IPatchReviewProps) => {
      setEditReviewModal(true);
      setSelectedReviewData(movieRowData);
    },
    []
  );
  // Update Review Action (PATCH request)
  const handleReviewUpdate = useCallback(async () => {
    try {
      const isTrueSet = selectedReviewData.isApproved.toString() === "true";
      const updateReviewData: IPatchReviewProps = {
        id: selectedReviewData.id,
        isApproved: isTrueSet,
      };
      const res: IDispatchResponse = await dispatch(
        updateMovieReviewById(updateReviewData)
      );
      if (!res.error) {
        setEditReviewModal(false);
      }
    } catch (error: any) {
      showNotification({
        title: "Updating review failed. See message below for more info.",
        message: error.message,
        autoClose: 3000,
        color: "yellow",
      });
    }
  }, [dispatch, selectedReviewData.id, selectedReviewData.isApproved]);

  // Filter reviews state by searched movie title values inside table
  const filteredItems: IMovieReview[] = reviews?.filter((item) =>
    item.movieReviews?.title.toLowerCase().includes(filterByName.toLowerCase())
  );

  // Review Table Columns
  const reviewsColumns: TableColumn<IMovieReview>[] = [
    {
      name: "Movie",
      selector: (row) => upperFirst(row.movieReviews?.title as string),
      sortable: true,
    },
    {
      name: "Reviewer",
      selector: (row) =>
        `${upperFirst(row.userReviewer?.firstName as string)} ${upperFirst(
          row.userReviewer?.lastName as string
        )}`,
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
        </>
      ),
      button: true,
    },
  ];

  return (
    <Paper className={classes.paper}>
      <Group position="apart" className={classes.head}>
        <TextInput
          placeholder="Search movie title"
          classNames={classes}
          value={filterByName}
          onChange={(event) => setFilterByName(event.currentTarget.value)}
        />
        <div>
          <Button
            radius="sm"
            color="blue"
            onClick={() => dispatch(fetchAllMovieReviews())}
          >
            All Reviews
          </Button>
          <Button
            radius="sm"
            color="blue"
            mx={5}
            onClick={() => dispatch(fetchApprovedMovieReviews())}
          >
            Approved Reviews
          </Button>
          <Button
            radius="sm"
            color="blue"
            onClick={() => dispatch(fetchUnapprovedMovieReviews())}
          >
            Unapproved Reviews
          </Button>
        </div>
      </Group>

      <Space h="md" />

      <DataTable
        title="Movie Reviews"
        columns={reviewsColumns}
        data={filteredItems}
        pagination
        dense
        sortIcon={<IconArrowDown />}
        theme="dark"
        customStyles={tableCustomStyles}
      />

      {/* View Review Modal */}

      <Modal
        opened={viewReviewModal}
        onClose={() => setViewReviewModal(false)}
        title={`Viewing a ${viewReviewData.movieReviews?.title} review`}
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
        title={`Update a ${viewReviewData.movieReviews?.title} Review`}
        centered
      >
        <SegmentedControl
          value={selectedReviewData?.isApproved?.toString()}
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
          Update Review
        </Button>
      </Modal>
    </Paper>
  );
};

export default TableReviews;
