import React from "react";
import "./DeleteBtn.css";

const DeleteBtn = props => (
	<button type="submit" className="btn btn-danger del-btn" {...props}>Delete Article</button>
);

export default DeleteBtn;
