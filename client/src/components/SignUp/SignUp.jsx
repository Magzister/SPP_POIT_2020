import * as React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Col, Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import * as PasswordValidator from 'password-validator';
import './SignUp.css';
import { graphqlEndpoint } from '../../App';

export default class SignIn extends React.Component {

    state = {
        nick: '',
        password: '',
        password2: '',
        schema: null,
        signUpError: '',
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

    _handleSignUp = async (event) => {
        event.preventDefault();

        try {
            let response = await axios.post(graphqlEndpoint, {
                query: `
                        mutation{
                            signUp(nick:"${this.state.nick}", password:"${this.state.password}")
                        }
                    `
            });

            console.log(response);

            debugger;

            if (response.data.errors) {
                this.setState({
                    ...this.state,
                    signUpError: response.data.errors[0].message,
                })
            } else {
                this.props.history.push('/sign-in');
            }

        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const isNicknameInvalid = this.state.nick.length < 4;
        const isPasswordsAreDifferent = this.state.password !== this.state.password2;
        const isPasswordInvalid = this.state.schema ? !this.state.schema.validate(this.state.password) : true;

        return (
          <div className="SignUpWrapper">
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
                  <FormGroup row>
                      <Label for="password2" sm={2}> Repeat Password</Label>
                      <Col sm={10}>
                          <Input type="password" name="password2" id="password2" invalid={this.state.password2.length > 0 && isPasswordsAreDifferent} placeholder="Repeat your password" onChange={this._handleChange} />
                      </Col>
                  </FormGroup>
                  <Button color="warning" size="md" disabled={isNicknameInvalid || isPasswordInvalid || isPasswordsAreDifferent} onClick={this._handleSignUp}> Sign up </Button>
              </Form>
              {this.state.signUpError && (<div className="error-block"> {this.state.signUpError} </div>)}
          </div>
        )
    }
}
