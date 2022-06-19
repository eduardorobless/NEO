import React from 'react'; 

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleTimeString(), 
            utc_time: new Date().toUTCString()
        }; 
    }

    componentDidMount() {
        this.intervalID = setInterval(
        () => this.setState({
            time: new Date().toLocaleString(),
            utc_time: new Date().toUTCString()
        }), 
        1000
        ); 
    }
    componentWillUnmount() {
        clearInterval(this.intervalID); 
    }

    render() {
        return (
            <div>
            <p className='local_clock'>
                The local time is {this.state.time}
            </p>
            <p className='utc_clock'>
                The UTC time is {this.state.utc_time}
            </p>
            </div>

        ); 
    }
}


export default Clock; 