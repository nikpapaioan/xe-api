var axios = require('axios');
var property = {
  title: "test2",
  type: "test2",
  area : "test2",
  price: 1.1,
  description: "test"
};
axios.post('http://localhost:5000/properties', { property: property })
  .then(function(response) {
    console.log(response.data); 
  })
  .catch(function(error) {
    console.log(error);
  });
