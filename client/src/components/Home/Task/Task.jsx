import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Task.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Task extends Component {

    state = {
        ...this.props,
    }


    static getDerivedStateFromProps(props, state) {

        if (props.isNew !== state.isNew) {
            return {
                ...state,
                isNew: props.isNew,
                _id: props.index
            };
        } else {
            return state;
        }
    }

    _changeHandler = (event) => {

        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
            isChanged: true,
        });

    }

    _dateChangeHandler = date => {
        this.setState({
            ...this.state,
            date: date.toDateString()
        });
    }

    _fileChangeHandler = (event) => {
        this.setState({
            ...this.state,
            file: event.target.files[0]
        })

    }


    _saveChanges = (event) => {

        this.props.updateTask({
            ...this.state
        });


        this.setState({
            ...this.state,
            isChanged: false
        });
    }

    _deleteTask = (event) => {
        this.props.deleteTask(this.state);
    }

    render() {

        const { description, date, filepath, progress } = this.state;

        return (
            <div className="TaskWrapper">
                <ul className={`Task shadow`}>
                    <li className="Task__description">
                        <input className="border-0 w-75" name="description" type="text" placeholder="enter description" value={description} onChange={this._changeHandler} />
                    </li>
                    <li className="Task__date">
                        <DatePicker selected={new Date(this.state.date)} onChange={this._dateChangeHandler} ></DatePicker>
                    </li>
                    <li className="Task__status">
                        <select className="custom-select border-0" name="progress" value={progress} onChange={this._changeHandler}>
                            <option value="todo"> todo </option>
                            <option value="in progress"> in progress </option>
                            <option value="ready"> ready </option>
                        </select>
                    </li>
                    <li className="Task__delete">
                        <Button close onClick={this._deleteTask} ></Button>
                    </li>
                </ul>
                <button disabled={this.state.description.length === 0} className={`btn btn-warning ml-1 h-75 savebtn ${this.state.isChanged ? "visible" : "invisible"}`} onClick={this._saveChanges}>
                    Save
                </button>
            </div>
        )
    }
}

export default Task;
