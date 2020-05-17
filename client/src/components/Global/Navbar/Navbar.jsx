import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../../context';
import axios from 'axios';

export default class Navmenu extends React.PureComponent {

    static contextType = AuthContext;

    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    signOut = async (event) => {
        event.preventDefault();

        console.log(this.context);

        localStorage.removeItem('jwt');
        this.context.setAuthorised(false, null);
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm bg-info box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} className ="text-warning" to="/">Home</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                {
                                    !this.context.isAuthorised ? (
                                        <React.Fragment>
                                            <NavItem>
                                                <NavLink tag={Link} className="text-warning" to="/sign-up"> Sign Up </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink tag={Link} className="text-warning" to="/sign-in"> Sign In </NavLink>
                                            </NavItem>
                                        </React.Fragment>
                                    ) : (
                                            <React.Fragment>
                                                <NavItem>
                                                    <NavLink tag={Link} className="text-warning" to="/"> Tasks </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink tag={Link} className="text-warning" to="/" onClick={this.signOut}> Sign out </NavLink>
                                                </NavItem>
                                            </React.Fragment>
                                        )
                                }
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}
