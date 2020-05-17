import * as React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './SignIn.css';
import * as PasswordValidator from 'password-validator';
import { AuthContext } from '../../context';
import { signIn } from '../../socketEvents';
import {socket} from '../../App';

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
        });

        socket.on(signIn, (data) => {

            if(data.error){
                this.setState({ signInError: data.error });
                this.context.setAuthorised(false);
            }else{
                console.log(this.context);
                localStorage.setItem('jwt', data.token);
                this.context.setAuthorised(true, data.token);
                this.props.history.push('/');
            }

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
            socket.emit(signIn, {nick: this.state.nick, password: this.state.password});
        } catch (error) {
            console.log(error);
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
