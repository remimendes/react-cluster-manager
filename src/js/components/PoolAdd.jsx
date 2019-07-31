import React, { useState } from "react";

import { apiInstanceAction } from "../api.js"
import { useKeywords } from "../hooks/Keywords.jsx"
import { SectionForm } from "./SectionForm.jsx"
import { useStateValue } from '../state.js';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
        fab: {
                marginTop: theme.spacing(2),
        },
}))

function PoolAdd(props) {
	const {path} = props
	const [open, setOpen] = React.useState(false)
	const [data, setData] = useState({})
	const kws = useKeywords("ccfg")
	const [{user}, dispatch] = useStateValue();
	const classes = useStyles()
	if (!("root" in user.grant)) {
		return null
	}
	if (!kws) {
		return null
	}
        function handleClickOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
	function handleSubmit(e) {
		var kw = []
		for (var k in data) {
			if (k == "sectionName") {
				continue
			}
			if (!data[k]) {
				continue
			}
			var _kw = "pool#"+data.sectionName+"."+k+"="+data[k]
			kw.push(_kw)
		}
		console.log("SUBMIT", data.sectionName, data.type, data, "=>", kw)
		apiInstanceAction("ANY", "cluster", "set", {kw: kw}, (data) => dispatch({type: "parseApiResponse", data: data}))
		handleClose(e)
	}
	return (
		<React.Fragment>
			<Fab
				color="primary"
				onClick={handleClickOpen}
				className={classes.fab}
			>
				<AddIcon />
			</Fab>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Create New Pool</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A pool hosts data volumes abstracted from nodes hardware.
					</DialogContentText>
					<SectionForm kind="Pool" kws={kws.pool} data={data} setData={setData} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="secondary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}

export {
	PoolAdd,
}
