import * as React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './SignIn.css';
import * as PasswordValidator from 'password-validator';
import { AuthContext } from '../../context';

export default class SignIn extends React.Component {

    static contextType = AuthContext;

    state = {
        nick: '',
        password: '',
        schema: null,
        signInError: ''
    }

    componentDidMount() {

        let schema = new PasswordValidator();

        schema
            .is().min(5)
            .is().max(100)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().not().spaces()
            .is().not().oneOf(['Passw0rd', 'Password123', '12345678', 'qwerty']);

        this.setState({
            ...this.state,
            schema
        })
    }

    _handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    _handleSignIn = async (event) => {
        event.preventDefault();

        try {

            const response = await axios.post('http://localhost:8080/signIn', {
                nick: this.state.nick,
                password: this.state.password
            }, { withCredentials: true });

            console.log(response);
            this.context.setAuthorised(true);

            this.props.history.push('/');

        } catch (error) {
            console.log(error);
            this.setState({ signInError: error.response.data })
            this.context.setAuthorised(false);
        }
    }

    render() {
        const isNicknameInvalid = this.state.nick.length < 4;
        const isPasswordInvalid = this.state.schema ? !this.state.schema.validate(this.state.password) : true;

        return (
            <div className="SignInWrapper">
                <Form>
                    <FormGroup row>
                        <Label for="nick" sm={2}>Nick</Label>
                        <Col sm={10}>
                            <Input type="nick" name="nick" id="nick" invalid={isNicknameInvalid} placeholder="Enter your nick" onChange={this._handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={2}>Password</Label>
                        <Col sm={10}>
                            <Input type="password" name="password" id="password" invalid={this.state.password.length > 0 && isPasswordInvalid} placeholder="Enter your password" onChange={this._handleChange} />
                        </Col>
                    </FormGroup>
                    <Button color="warning" size="md" disabled={isNicknameInvalid || isPasswordInvalid} onClick={this._handleSignIn}> Sign in </Button>
                </Form>
                {this.state.signInError && (<div className="error-block"> {this.state.signInError} </div>)}
            </div>
        )
    }
}
