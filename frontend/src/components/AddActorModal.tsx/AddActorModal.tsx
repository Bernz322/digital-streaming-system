import {
  Button,
  Modal,
  NumberInput,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { addActor } from "../../features/actor/actorSlice";
import { useTypedDispatch } from "../../hooks/rtk-hooks";
import { isValidName, isValidUrl } from "../../utils/helpers";
import { IDispatchResponse, IPostActor } from "../../utils/types";
import { useStyles } from "../Tables/TableStyles";

function AddActorModal({ addActorModal, setAddActorModal }: any) {
  const { classes } = useStyles();
  const dispatch = useTypedDispatch();
  // Actor states for adding, updating, deleting
  const [newActor, setNewActor] = useState<IPostActor>({
    firstName: "",
    lastName: "",
    gender: "male",
    age: 0,
    image: "",
    link: "",
  });

  // Add Actor Action (POST request)
  const handleAddActor = useCallback(async () => {
    try {
      // Validate input fields
      isValidName(newActor.firstName, "first");
      isValidName(newActor.lastName, "last");
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
        title: "Adding actor failed. See message below for more info.",
        message: error.message,
        autoClose: 3000,
        color: "yellow",
      });
    }
  }, [dispatch, newActor, setAddActorModal]);

  return (
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
        withAsterisk
      />
      <NumberInput
        placeholder="Actor age"
        label="Actor age"
        defaultValue={newActor?.age}
        onChange={(value) => setNewActor({ ...newActor, age: value as number })}
        hideControls
        withAsterisk
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
        withAsterisk
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
  );
}

export default AddActorModal;
