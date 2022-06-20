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
      format_time(hour, minute) {
        return hour + ":" + minute
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


        if (hourUTC.length === 1) {
            hourUTC = this.paddingLeftZeros(hourUTC);
        }
        if (minUTC.length === 1) {
            minUTC = this.paddingLeftZeros(minUTC);
        }


        return this.format_time(hourUTC, minUTC);
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


        return this.format_time(hourLocal, minLocal);

      }

      getTodayLocalDateTime(today) {
        return this.getTodayLocalDate(today) + " " + this.getTodayLocalTime(today);
      }
      

      parseDetectionDate(detectionDate, local) {
        const months = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          }

        let datetime = detectionDate.split(" ")
        let date = datetime[0].split("-")
        let year = date[0];
        let month =months[date[1]];
        let day = date[2];

        let time = datetime[1].split(":");
        let hour = time[0];
        let min = time[1]; 
        //alert(new Date(Date.UTC(year, month, day, hour, min) ) )
        const parsed_date = new Date(Date.UTC(year, month, day, hour, min)); 
        if (local === true) {
            return this.getTodayLocalDateTime(parsed_date);
        }
        else {
            return this.getTodayUTCDateTime(parsed_date); 
        }
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
                            <td>Local Date</td>
                            <td>How fast? (Km/s)</td>
                            <td>How far from us? (Km)</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.absolute_magnitude_h}</td>
                            <td>{item.estimated_diameter.kilometers.estimated_diameter_min} </td>
                            <td>{item.estimated_diameter.kilometers.estimated_diameter_max}</td>
                            <td>{item.is_potentially_hazardous_asteroid ? 'Yes': 'No'}</td>
                            <td>{this.parseDetectionDate(item.close_approach_data[0].close_approach_date_full, false)}</td>
                            <td>{this.parseDetectionDate(item.close_approach_data[0].close_approach_date_full, true)}</td>
                            <td>{item.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                            <td>{item.close_approach_data[0].miss_distance.kilometers}</td>
                        </tr>
                    ))  }
                    </tbody>
                </table>
                </div>

            );
        }
    }
}

export default NeoComponent;