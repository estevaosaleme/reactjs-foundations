import React, { useState, useEffect} from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import api from './../services/api';
import { FormEvent } from 'react';

interface Repository {
  id: string;
  title: string;
  url: string;
  stack: [];
}

function Repositories(){

    const [open, setOpen] = useState(false);
    const [dense, setDense] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [message, setMessage] = useState("Message");

    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [stack, setStack] = useState("");

    useEffect(() => {
      setLoading(true);
      api.get('repositories').then(response => {
        setLoading(false);
        setRepositories(response.data);
      });
    }, []);

    function handleClickOpen() {
      setTitle("");
      setUrl("");
      setStack("");
      setOpen(true);
    };

    function handleClose() {
      setOpen(false);
    };

    async function handleSave(){

      const data = {
        title,
        url,
        stack: stack.split(',')
      }

      const response = await api.post('repositories', data);
      if (response){
        const repository = response.data;
        setRepositories([...repositories, repository]);
        setOpen(false);
        setMessageOpen(true);
        setMessage("The item has been saved!");
      }
    }

    async function handleDelete(id:string) {
      const response = await api.delete(`repositories/${id}`);
      if (response) {
        const copyRepositories = [...repositories];
        copyRepositories.splice(copyRepositories.findIndex(item => item.id === id),1);
        setRepositories(copyRepositories);
      }
    };

    function handleCloseMessage (event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
      if (reason === 'clickaway') {
        return;
      }
  
      setMessageOpen(false);
    };

    const classes = useStyles();
    
    return (
        <div className={classes.root}>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={messageOpen}
          autoHideDuration={5000}
          onClose={handleCloseMessage}
          message="Message"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={handleCloseMessage}>
                {message}
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseMessage}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />

        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Add New Repository
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Repository</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Please type in the information about the repository you want to add.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="string"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                required
            />
            <TextField
                margin="dense"
                id="url"
                label="URL"
                type="string"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                fullWidth
                required
            />
            <TextField
                margin="dense"
                id="stack"
                label="Stack"
                type="string"
                helperText="Comma separated eg. Node.js, React.js, etc."
                value={stack}
                onChange={(event) => setStack(event.target.value)}
                fullWidth
                required
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>

        <Grid item xs={10} md={3}>
          <Typography variant="h6" className={classes.title}>
            My Repositories List
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
                {repositories.map( item => {
                  return (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.title}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
            </List>
          </div>
        </Grid>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default Repositories;