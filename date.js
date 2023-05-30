exports.getDate = function () {
  
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
    };
  
  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
  
  const today = new Date();
  const options = {
      weekday: "long",
    };
    
    return today.toLocaleTimeString("en-US");
};
