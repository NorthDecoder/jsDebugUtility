//filename = vvD_module.js

/** # Vivid Ventures Debug - vvD

    ## Syntax:

       vvD.modal(verbose,logMsg,dirMsg);
          // type tested messages in browser

       vvD.konsole(verbose,logMsg,dirMsg);
          // messages in console

       ### Parameters
       verbose - required. boolean true or false turns messaging on or off

       logMsg - required. string
             modal -
               a string will be displayed in the html
               tagged #test-message
               an empty string "" will hide the html
               tagged #test-message

             konsole -
               the parameter will be displayed in the console.log

       dirMsg -  optional. object type tested and displayed with console.dir()
                 and it works with modal too.

    ## Dependency:
       None

    ## Browsers tested in
       Firefox Version 45.0 on MacBook
       Chrome Version 49.0.2623.87 (64-bit) on MacBook

    ## Usage:
       //in browser
         vvD.modal(true,"Message shown in browser page",{"key":"value"});
         vvD.modal(false,"Message hidden in browser page",{"key":"value"});

       //in console
         vvD.konsole(true,"Message shown in console",{"key":"value"});
         vvD.konsole(false,"Message hidden for console",{"key":"value"});

       ### Anti-patterns:
         vvD.modal(true,{"key":"value"});// 2nd parameter has type error
         vvD.modal(true);// too few parameters,
         vvD.modal("false","First parameter should be boolean not string");// 1st parameter type error
*/

//console.log("vvD_module.js loaded");
//vvD MODULE defined
var vvD = vividVenturesDebug = (function () {
  var my = {};

  my.version = "0.0.1";//this should match the git tag

  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  my.modal = function (verbose,logMsg,dirObj) {//in the browser
    var result = {};//of validating the input parameters
    result.errCount=0;
    result.errCode="";

    /* konsole css styles for the messages */
       // reference: http://stackoverflow.com/questions/7505623/colors-in-javascript-console
       //            https://developer.mozilla.org/en-US/docs/Web/API/console
    var css = {};//style for the text in the console.log !
        css.prefix = "color:#1A3151;"+
                     "background-color:#ff6666;"+
                     "border-radius: 3px;"+
                     "padding-left: 3px;"+
                     "padding-right: 3px";

        css.body   = "color:#1A3151;"+
                     "background-color:#e6ffff;"+
                     "border-radius: 3px;"+
                     "padding-left: 3px;"+
                     "padding-right: 3px";

    // vvvvvvvvvvvv Validate Input Parameters vvvvvvvvvvvvvvvvvvvv

    if(typeof(verbose) !== 'boolean'){
        console.log("%cvvD.browser:%c 'verbose' type is expected to be boolean. typeof(verbose) is " +
                  typeof(verbose) + ": " + verbose , css.prefix, css.body);
        result.errCode = "not_boolean";
        result.errCount++;
    }//end if

    if(typeof(logMsg) !== 'string'){
      console.log( "%cvvD.browser:%c logMsg type is expected to be string. typeof(logMsg) is " +
                   typeof(logMsg)  , css.prefix, css.body);
      result.errCode = "not_a_string";
      result.errCount++;
    }

    if(dirObj!==undefined && typeof(dirObj) !== 'object'){
        console.log("%cvvD.browser:%c dirObj type is expected to be object. typeof(dirObj) is " +
                     typeof(dirObj) + ": '" + dirObj + "'" , css.prefix, css.body);
      result.errCode = "not_an_object";
      result.errCount++;
    }

    if(arguments.length < 2){//first two arguments required
        console.log("%cvvD.browser:%c function vvD.browser expecting " +
                     "at least first two parameters 'verbose', 'logMsg' " , css.prefix, css.body);
        result.errCode = "min_param_qty=2";
        result.errCount++;
    }

    if ( document.getElementById("test-message").innerHTML.length > 0) {/*carry on*/
    } else {
            console.log("%cvvD.browser:%c The html tag with 'id=test-message' is missing!" , css.prefix, css.body);
        result.errCount++;
    }

    if(result.errCount >= 3){
      console.log("%cvvD.browser:%c Three or more typeof() errors, see the debugDisplayMessage()" +
                  " syntax documention at: https://github.com/NorthDecoder/jsDebugUtility " , css.prefix, css.body);
    }

  // ^^^^^^^^^^^^^^^^^ End of Validate Input Parameters ^^^^^^^^^^^^^^^^^^^^



  // DOM manipulation without jQuery
        if(verbose===false){//make invisible
          document.getElementById("test-message").style.display = "none";
        }//else continue

        if( logMsg!=="" && verbose === true && dirObj===undefined){//implies defined, and not set to empty
          document.getElementById("test-message").style.display= "inline";//make visible
          document.getElementById("test-message").innerHTML = logMsg;
        }else if( logMsg!=="" && verbose === true && dirObj!==undefined){//there is a dirObj
            var str = JSON.stringify(dirObj, undefined, 4);//prettify the json
            logMsg += "\n"+str;// newline and put the two messages together
            document.getElementById("test-message").style.display= "inline";//make visible
            document.getElementById("test-message").innerHTML = logMsg;//put it on the page
        }else{
            document.getElementById("test-message").style.display = "none";//make invisible
        }

  return result;
  };//end my.browser



  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  //** vvD.konsole  */
  my.konsole = function (verbose,logMsg,dirObj) {//in console
    var result = {};
        result.errCode = "";
        result.msg = "";

    /* konsole css styles for the messages */
       // reference: http://stackoverflow.com/questions/7505623/colors-in-javascript-console
       //            https://developer.mozilla.org/en-US/docs/Web/API/console
    var css = {};//style for the console.log text !
        css.prefix = "color:#1A3151;"+
                     "background-color:#39669D;"+
                     "border-radius: 3px;"+
                     "padding-left: 3px;"+
                     "padding-right: 3px";

        css.body   = "color:#1A3151;"+
                     "background-color:#e6ffff;"+
                     "border-radius: 3px;"+
                     "padding-left: 3px;"+
                     "padding-right: 3px";

    /** Check logMsg for special horizontal rule characters and duplicate */
    if (logMsg!==undefined && typeof(logMsg)==='string') {
        var hzdivider = "";
        // Reference:  hzrule.js
        // https://gist.github.com/NorthDecoder/77bd1a27ef26c3756b1b
        var str = logMsg.match(/^[v^~=*+]/);// any one of these at beginning
        if (str !== null) {
             for (var i = 0; i < logMsg.length * 5; i++) {
                 hzdivider += str + " ";
             }
             logMsg = hzdivider; //create the hzrule divider
        } else {// do nothing but
                // but keep original logMsg;
        }
      //end hzrule.js
    }//end if is logMsg a string

    result.msg = logMsg;//capture the hzdivider string


    if(verbose===true){//log whatever with few restrictions
        try{
            console.log("%cvvD.konsole: %c" + logMsg , css.prefix, css.body);//  css.prefix
        }catch(err){
            result.errCode = err;
            console.log("%cvvD.konsole: %c" + err, css.prefix, css.body);
        }
    }//else keep quiet

    if(verbose===true && dirObj!== undefined){
        try{
            if(typeof(dirObj)!=="object"){
              console.log("%cvvD.konsole: %c" +
                           dirObj +
                           " is not an object it is a " +
                            typeof(dirObj), css.prefix, css.body);
              result.errCode = "not_an_object";
            }
            console.dir(dirObj);
        }catch(err){
            result.errCode = err;
            console.log("%cvvD.konsole: %c" + err, css.prefix, css.body);
        }
    }//else keep quiet

    if(arguments.length < 2){//first two arguments required
        console.log("%cvvD.konsole: %c" +
                    "function vvD.konsole expecting " +
                    "at least first two parameters 'verbose', 'logMsg' ", css.prefix, css.body);
        result.errCode = "min_param_qty=2";
        result.errCount++;
    }

    return result;

  };//end my.konsole



  return my;//expose the public module methods and properties in the 'my' object
}());//End of vvD module
// ///////////////////
