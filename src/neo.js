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
      


    constructor(props) {
        super(props);
        let api_key = process.env.REACT_APP_NASA_API_KEY; 
        let start_date = '2022-06-14'; 
        let end_date = '2022-06-14';
        let url = this.formatter("https://api.nasa.gov/neo/rest/v1/feed?start_date={0}&end_date={1}&api_key={2}", start_date, end_date, api_key);
        this.state = {
            error: null, 
            isLoaded: false, 
            items: [], 
            url: url 
        }
    }

    componentDidMount() {
        fetch(this.state.url)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true, 
                    items: result.near_earth_objects['2022-06-14']
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
                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            {item.id} {item.name}
                        </li>
                    ))}
                </ul>
            );
        }

    }
}

export default NeoComponent;