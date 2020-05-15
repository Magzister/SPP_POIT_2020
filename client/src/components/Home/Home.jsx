import React, { Component } from 'react';
import Task from './Task/Task';
import './Home.css';
import moment from 'moment';
import axios from 'axios';
import { AuthContext } from '../../context';
import { Redirect } from 'react-router-dom';

export default class Home extends Component {

    static contextType = AuthContext;

    state = {
        filters: {
            showTodos: { checked: true, name: 'todo' },
            showInProgress: { checked: true, name: 'in progress' },
            showReady: { checked: true, name: 'ready' }
        },
        tasks: [],
    }

    componentDidMount() {
        this._getTasks(['todo', 'in progress', 'ready']);
    }

    _getTasks = async (states) => {
        try {
            const response = await axios.get(`http://localhost:8080/tasks?progress=${states.join(',')}`, { withCredentials: true });

            this.setState({
                ...this.state,
                tasks: response.data.map((task) => ({...task, index: task._id}))
            });

        } catch (error) {
            console.log(error.response);
            if (error.response.status === 401) {
                this.context.setAuthorised(false);
                this.props.history.push('/sign-in');
            }
        }

    }

    _filterNames = ['showTodos', 'showInProgress', 'showReady'];

    _updateFilter = (event) => {
        console.log(event.target.name);

        let filters = { ...this.state.filters };

        filters[event.target.name].checked = !filters[event.target.name].checked;

        this._getTasks(Object.values(this.state.filters).filter((filter) => { return filter.checked }).map(filter => filter.name));

        this.setState({
            ...this.state,
            filters
        })
    }

    _addNewTask = (event) => {

        const tasks = [...this.state.tasks];

        const index = Date.now() + tasks.length + 1;

        tasks.push({
            description: '',
            date: new Date().toISOString(),
            filepath: null,
            progress: 'todo',
            isChanged: true,
            isNew: true,
            index
        });

        this.setState({
            ...this.state,
            tasks
        });

    }

    _updateTask = async (task) => {

        try {

            let response;

            if (task.isNew) {
                response = await axios.post("http://localhost:8080/tasks", {
                    ...task
                }, { withCredentials: true });

                const tasks = [...this.state.tasks];

                const deleteStartIndex = tasks.findIndex((value) => { return value.index === task.index });

                tasks.splice(deleteStartIndex, 1);

                tasks.splice(deleteStartIndex, 0, {
                    ...task,
                    _id: response.data._id,
                    isNew: false,
                    isChanged: false
                });

                this.setState({
                    ...this.state,
                    tasks
                });

            } else {
                response = await axios.put(`http://localhost:8080/tasks/${task._id ? task._id : task.index}`, {
                    ...task
                }, { withCredentials: true });
            }

            this._getTasks(Object.values(this.state.filters).filter((filter) => { return filter.checked }).map(filter => filter.name));

        } catch (error) {
            console.log(error);
        }
    }

    _deleteTask = async (task) => {

        try {

            let response;

            const tasks = [...this.state.tasks];

            tasks.splice(tasks.findIndex((value) => { return value.index === task.index }), 1);


            if (!task.isNew) {
                response = await axios.delete(`http://localhost:8080/tasks/${task._id ? task._id : task.index}`, { withCredentials: true });
            }

            this.setState({
                ...this.state,
                tasks
            });

        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (this.context.isAuthorised) {

            return (
                <div>
                    <ul className="Filters shadow-sm">
                        <li className="mr-2">
                            <button type="button" className="btn btn-warning" onClick={this._addNewTask}>
                                Add Task
                            </button>
                        </li>
                        <li>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" name="showTodos" type="checkbox" id="todo" onChange={this._updateFilter} checked={this.state.filters.showTodos.checked} />
                                <label className="form-check-label" htmlFor="todo"> todo </label>
                            </div>
                        </li>
                        <li>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" name="showInProgress" type="checkbox" id="inProgress" onChange={this._updateFilter} checked={this.state.filters.showInProgress.checked} />
                                <label className="form-check-label" htmlFor="inProgress"> in progress </label>
                            </div>
                        </li>
                        <li>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" name="showReady" type="checkbox" id="ready" onChange={this._updateFilter} checked={this.state.filters.showReady.checked} />
                                <label className="form-check-label" htmlFor="ready"> ready </label>
                            </div>
                        </li>
                    </ul>
                    {
                        this.state.tasks.map((task) => {

                            const { description, date, filepath, progress, isChanged, isNew, _id, index } = task;

                            return <Task
                                key={index ? index : _id}
                                index={_id ? _id : index}
                                description={description}
                                date={date} filepath={filepath}
                                progress={progress}
                                isDateValid={moment(date, 'DD.MM.YYYY').isValid()}
                                isChanged={isChanged}
                                updateTask={this._updateTask}
                                deleteTask={this._deleteTask}
                                isNew={isNew}>
                            </Task>
                        })
                    }
                </div >
            )
        } else {
            return (<Redirect to='/sign-in'></Redirect>);
        }
    }
}
