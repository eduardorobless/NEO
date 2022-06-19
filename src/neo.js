import React from 'react';

class NeoComponent extends React.Component {
        formatter() { 
        var num = arguments.length; 
        var oStr = arguments[0];   
        for (var i = 1; i < num; i++) { 
          var pattern = "\\{" + (i-1) + "\\}"; 
          var re = new RegExp(pattern, "g"); 
          oStr = oStr.replace(re, arguments[i]); 
        } 
        return oStr; 
      } 
      
      getTodayDate() {
        const today = new Date()
        var dayUTC = today.getUTCDate().toString(); 
        var monthUTC = (today.getUTCMonth() + 1).toString(); 
        var yearUTC = today.getUTCFullYear().toString(); 

        if (dayUTC.length === 1) {
            dayUTC = "0" + dayUTC;             
        }
        if (monthUTC.length === 1) {
            monthUTC = "0" + monthUTC; 
        }

        return yearUTC + "-" + monthUTC + "-" + dayUTC        
      }


    static api_key; 
    static start_date;
    static end_date; 
    static url;


    constructor(props) {
        super(props);
        this.api_key = process.env.REACT_APP_NASA_API_KEY; 
        this.start_date = this.getTodayDate();
        this.end_date = this.start_date; 
        this.url = this.formatter("https://api.nasa.gov/neo/rest/v1/feed?start_date={0}&end_date={1}&api_key={2}", this.start_date, this.end_date, this.api_key);

        this.state = {
            error: null, 
            isLoaded: false, 
            items: [], 
            currentLocalTime: null, 
            currentUTCTime: null
        }

    }

    componentDidMount() {

        fetch(this.url)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true, 
                    items: result.near_earth_objects['2022-06-19'], 
                    currentLocalTime: new Date().toLocaleString(), 
                    currentUTCTime: new Date().toUTCString()
                });
            }, 
        (error) => {
            this.setState({
                isLoaded: true, 
                error
            }); 
        }
        ) 
    }

    render() {
        const { error, isLoaded, items} = this.state; 
        if (error) {
            return <div>error: {error.message}</div>; 
        } else if(!isLoaded) {
            return <div>Loading ... </div>;
        } else {
            return (
                <div>
                    <div id="time">
                        <span>Local time: {this.state.currentLocalTime}</span>
                        <span>UTC time: {this.state.currentUTCTime}</span>
                    </div>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Brightness (H)</td>
                            <td>Estimated diameter minimum (Km)</td>
                            <td>Estimated diameter maximum (km)</td>
                            <td>Dangerous?</td>
                            <td>Date of detection (UTC)</td>
                            <td>How fast? (Km/s)</td>
                            <td>How far from us? (Km)</td>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.absolute_magnitude_h}</td>
                            <td>{item.estimated_diameter.kilometers.estimated_diameter_min} </td>
                            <td>{item.estimated_diameter.kilometers.estimated_diameter_max}</td>
                            <td>{item.is_potentially_hazardous_asteroid ? 'Yes': 'No'}</td>
                            <td>{item.close_approach_data[0].close_approach_date_full}</td>
                            <td>{item.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                            <td>{item.close_approach_data[0].miss_distance.kilometers}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

            );
        }

    }
}

export default NeoComponent;