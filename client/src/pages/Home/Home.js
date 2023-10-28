import React, { useState, useEffect } from 'react';
import PostDisplay from '../../components/PostDisplay/PostDisplay.js';
import RollAndSubmit from '../../components/RollAndSubmit/RollAndSubmit.js';

const Home = () => {
    const [data, setData] = useState([]);
    const [rkey, refresh] = useState(0);
    useEffect(() => {
        fetch(`http:/${process.env.REACT_APP_EC2IP}/:${REACT_APP_EC2PORT}/`, { headers:{'Access-Control-Allow-Origin': '*'}})
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setData(data);
        })
        .catch(error => {
            console.error('Fetch error: ', error);
        })
    }, [rkey]);
    return (
        <div class="container">
          <div class="d-flex flex-column align-items-center justify-content-center mt-5">
            <PostDisplay data={data} />
            <RollAndSubmit data={data} refresh={refresh} rkey={rkey} />
          </div>
        </div>
    );
};

export default Home;