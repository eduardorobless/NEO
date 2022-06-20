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

      paddingLeftZeros(datesubstring) {
        return  "0" + datesubstring; 
      }

      format_date(year, month, day) {
        return year + "-" + month + "-" + day
      }
      format_time(hour, minute, second) {
        return hour + ":" + minute + ":" + second
      }

      getTodayUTCDate(today) {
        var dayUTC = today.getUTCDate().toString(); 
        var monthUTC = (today.getUTCMonth() + 1).toString(); 
        var yearUTC = today.getUTCFullYear().toString(); 

        if (dayUTC.length === 1) {
            dayUTC = this.paddingLeftZeros(dayUTC);     
        }
        if (monthUTC.length === 1) {
            monthUTC = this.paddingLeftZeros(monthUTC);
        }

        return this.format_date(yearUTC, monthUTC, dayUTC);
      }

      getTodayUTCTime(today) {
        var hourUTC = today.getUTCHours().toString();
        var minUTC = today.getUTCMinutes().toString();
        var secUTC = today.getUTCSeconds().toString();


        if (hourUTC.length === 1) {
            hourUTC = this.paddingLeftZeros(hourUTC);
        }
        if (minUTC.length === 1) {
            minUTC = this.paddingLeftZeros(minUTC);
        }
        if(secUTC.length === 1) {
            secUTC = this.paddingLeftZeros(secUTC);
        }

        return this.format_time(hourUTC, minUTC, secUTC);
      }

      getTodayUTCDateTime(today) {
        return this.getTodayUTCDate (today) + " " + this.getTodayUTCTime(today); 
      }


      getTodayLocalDate(today) {
        var dayLocal = today.getDate().toString();
        var monthLocal = (today.getMonth() + 1).toString();
        var yearLocal = today.getFullYear().toString();

        if (dayLocal.length === 1) {
            dayLocal = this.paddingLeftZeros(dayLocal);
        }
        if (monthLocal.length === 1) {
            monthLocal = this.paddingLeftZeros(monthLocal);
        }

        return this.format_date(yearLocal, monthLocal, dayLocal);
      }

      getTodayLocalTime(today) {
        var hourLocal = today.getHours().toString();
        var minLocal = today.getMinutes().toString();
        var secLocal = today.getSeconds().toString();

        if(hourLocal.length === 1) {
            hourLocal = this.paddingLeftZeros(hourLocal);
        }
        if (minLocal.length === 1) {
            minLocal = this.paddingLeftZeros(minLocal);
        }
        if(secLocal.length === 1) {
            secLocal = this.paddingLeftZeros(secLocal);
        }

        return this.format_time(hourLocal, minLocal, secLocal);

      }

      getTodayLocalDateTime(today) {
        return this.getTodayLocalDate(today) + " " + this.getTodayLocalTime(today);
      }


    static api_key; 
    static start_date;
    static end_date; 
    static url;


    constructor(props) {
        super(props);
        this.api_key = process.env.REACT_APP_NASA_API_KEY; 
        this.start_date = this.getTodayUTCDate(new Date());
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
                const todaydate = new Date(); 
                this.setState({
                    isLoaded: true, 
                    items: result.near_earth_objects[this.start_date], 
                    currentLocalTime: this.getTodayLocalDateTime(todaydate), 
                    currentUTCTime: this.getTodayUTCDateTime(todaydate)
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