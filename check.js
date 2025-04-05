const paramfunc=function() {
    console.log("I am paramfunction");
}
const higherOrderFunction=function(paramfunc){
    console.log("I am higher order function");
    paramfunc();
}

higherOrderFunction(paramfunc);