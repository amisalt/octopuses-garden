function errorFormatter({location, msg, param, value, nestedErrors}){
  console.log(location, msg, param, value, nestedErrors);
  return {
    location,
    msg,
    path:param,
    value,
    nestedErrors,
    type:'user'
  }
}

module.exports = errorFormatter