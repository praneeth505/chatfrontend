import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "./modal.css";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function TransitionsModal(props) {
  console.log("modal");
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);
  const [groupName, setGroupName] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.close();
    setOpen(false);
  };

  const handleCloseAndSubmit = () => {
    console.log("modal", groupName);
    props.saveGroupName(groupName);
    props.close();
    setOpen(false);
  };

  const handleChange = e => {
    console.log(e.target.value);
    setGroupName(e.target.value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}

        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <label>
              Group Name:
              <input
                type="text"
                value={groupName}
                onChange={handleChange}
              ></input>
            </label>
            <br />
            <div className="flex-modal">
              <div>
                <button onClick={handleCloseAndSubmit}>save</button>
              </div>

              <div>
                <button onClick={handleClose}>cancel</button>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
