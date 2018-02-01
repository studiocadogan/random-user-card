import React, {Component, Fragment} from 'react';
import axios from 'axios';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';
import PropTypes from 'prop-types';
import './App.css';
import './webfonts/ss-standard.css'



class App extends Component {
    static propTypes = {
        flag: PropTypes.bool,
        firstName: PropTypes.bool,
        lastName: PropTypes.bool,
        title: PropTypes.bool,
        picture: PropTypes.bool,
        email: PropTypes.bool,
        location: PropTypes.object,
        dob: PropTypes.bool,
        dobFormat: PropTypes.string
    }

    static defaultProps = {
        dobFormat: 'LL',
        dob: true,
        location: {city: true, street: true, state: true},
        flag: true,
        firstName: true,
        lastName: true,
        picture: true,
        email: true,
    }

    constructor() {
        super();
        this.state = {
            loaded: false,
            user: {}
        }
    }

    componentDidMount() {
        axios.get('https://randomuser.me/api').then(res => this.setState({ user: res.data.results[0]})).then(() => this.loadCountryName())
    }

    loadCountryName(){
        return axios.get(`https://restcountries.eu/rest/v2/alpha/${this.state.user.nat}`).then(res => this.setState({loaded: true, countryName: res.data}))
    }

    render() {
        const {user, loaded, countryName} = this.state;
        const {flag, firstName, lastName, title, dob, picture, email, location, dobFormat} = this.props;

        return (
            <div className="user-card">
                {!loaded ?
                    <span className="loader"/>
                    :
                    <Fragment>
                        {flag && <div className="country-flag-cont">
                            <ReactCountryFlag code={user.nat}/>
                        </div>}
                        {picture && <div className="img-cont">
                            <img src={user.picture.large} alt=""/>
                            <span className="user-bio">{user.login.username}</span>
                        </div>}

                        <div className="user-card-body">
                            <h1>{firstName && user.name.first} {lastName && user.name.last}</h1>
                            <h3>{countryName.name} {countryName.nativeName !== countryName.name && `(${countryName.nativeName})`} - {countryName.region}</h3>
                            {user.email && <b>email</b>}
                            <p className="user-eml">{email && user.email}</p>

                            {(location.street || location.city || location.state ) && <b>location</b>}
                            <p className="user-loc">{location.street && user.location.street}, {location.city && user.location.city}, {location.state && user.location.state}</p>
                            {dob && <b>date of birth</b>}
                            <p className="user-dob">{dob && moment(user.dob).locale(user.nat.toLowerCase()).format(dobFormat)}</p>
                            <div className="contact-row">
                                <a className="ss-phone" href={`tel: ${user.phone}`}/>
                                <a className="ss-mail" href={`mailto: ${user.email}`}/>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        );
    }
}

export default App;
