/** Filename: tests_for_vvD_module.js */
/** also known as specs using the jasmine syntax
    Reference: http://jasmine.github.io/2.4/introduction.html
*/

console.log("tests_for_vvD_module.js loaded");


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("In vvD_module.js ", function() {
  it("invoke vividVenturesDebug.version to get 0.0.1", function() {
    var version = "0.0.1";
    expect(vividVenturesDebug.version).toEqual(version);
  });
});


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("vvD.modal should detect erroneous input ", function() {

  it("where 'verbose' is not set to a boolean ", function() {
    var verbose = "true";//string "" should be boolean without quotes
    var logMsg = "div test";
    var dirObj = {"a":"simple object"};
    var result = vvD.modal(verbose,logMsg,dirObj);

    expect(result.errCode).toEqual("not_boolean");
  });

  it("where 'logMsg' is not a string ", function() {
    var verbose = true;
    var logMsg = 8;//should be a string
    var dirObj = {"a":"simple object"};
    var result = vvD.modal(verbose,logMsg,dirObj);

    expect(result.errCode).toEqual("not_a_string");
  });

  it("where 'dirObj' is not an object ", function() {
    var verbose = true;
    var logMsg = "dirObj should be an object";
    var dirObj = 8;//should be an object
    var result = vvD.modal(verbose,logMsg,dirObj);

    expect(result.errCode).toEqual("not_an_object");
  });

  it("where html tag with 'id=test-message' getElementById is not null ", function() {
    var msgThere;
    if(document.getElementById("test-message").innerHTML!==null){
      msgThere  = true;
    }else{msgThere = false;}
    expect(msgThere).toBe(true);
  });


  it("where qty of input parameters must be >= 2 ", function() {
    var verbose = true;
    var result = vvD.modal(verbose);//too few paramters

    expect(result.errCode).toEqual("min_param_qty=2");
  });

});//end describe


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("vvD.modal  ", function() {

  it("should hide html tag id=test-message when logMsg='' ", function() {
      var verbose = true;
      var logMsg = "";//empty string should hide the tag
      var dirObj = {"a":"simple object"};
      var result = vvD.modal(verbose,logMsg,dirObj);

      var dispStyle = document.getElementById("test-message").style.display;

      expect(dispStyle).toEqual("none");
  });//end it

  it("should display a debug message in the html tag id=test-message ", function() {
      var verbose = true;
      var logMsg = "See console.log for detailed messages.";
      var dirObj = {"a":"simple object","keep":"it simple"};
      var result = vvD.modal(verbose,logMsg,dirObj);
      var firstFew = logMsg.slice(0,15);
      expect(firstFew).toEqual(document.getElementById("test-message").innerHTML.slice(0,15));
  });//end it

  afterAll(function() {
      var verbose = false;
      vvD.modal(verbose,"");//clear and hide the div tag id=test-message
  });

});//end describe


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("vvD.konsole should detect erroneous input", function() {
  it("where input parameters quantity must be >= 2 ", function() {
    var verbose = true;
    var logMsg = "Missing second paramter, but konsole is permissive and "+
                 "prints 'undefined', which is the truth.";
    vvD.konsole(verbose,"=++");// a nice divider line preceding test
    vvD.konsole(verbose,logMsg);//next line has
    var result = vvD.konsole(verbose);//too few paramters

    expect(result.errCode).toEqual("min_param_qty=2");
  });//end it

  it("where an invalid object logs an error message", function() {
      var verbose = true;
      var logMsg = "Message to console here, to describe object ";
      //var dirObj = 'a custom string';// or
      var dirObj = 8;// a number
      var result = vvD.konsole(verbose,logMsg,dirObj);

      expect(result.errCode).toEqual("not_an_object");
  });//end it

});//end describe


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("vvD.konsole  ", function() {

  beforeAll(function() {
      //notify user in the browser that we are testing the konsole
      var verbose = true;
      var logMsg = "Testing function vvD.konsole:\n See browser console.log for detailed messages.";
      vvD.modal(verbose,logMsg);
  });

  it("should create a horizontal divider for the console.log ", function() {
      var verbose = true;
      var logMsg = "=xx";// also any of these characters: v ^ ~ = * +
      var result = vvD.konsole(verbose,logMsg);

      expect(result.msg).toEqual("= = = = = = = = = = = = = = = ");
  });//end it

  it("should log a message with 2 parameters, 'verbose' is true , and logMsg. ", function() {
      var verbose = true;
      var logMsg = "Message to console here, no object following.";
      var result = vvD.konsole(verbose,logMsg);

      expect(result.errCode).toEqual("");
  });//end it

  it("should console.dir an object when 'verbose' is true and an object is valid", function() {
      var verbose = true;
      var logMsg = "Message to console here, to describe object ";
      var dirObj = {"a":"simple object"};//or
      //var dirObj = function namedFunction(parm1,parm2){var i = 0;};//or
      //var dirObj = [0,1,2,3,4,5];//
      var result = vvD.konsole(verbose,logMsg,dirObj);

      expect(result.errCode).toEqual("");
  });//end it

});//end describe

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
describe("Usage examples from code comments  ", function() {
  it("that should not fail ", function() {
      var result = vvD.modal(true,"Message shown in browser page",{"key":"value"});
      expect(result.errCode).toEqual("");

      result = vvD.modal(false,"Message hidden in browser page",{"key":"value"});
      expect(result.errCode).toEqual("");

      result = vvD.konsole(true,"Message shown in console",{"key":"value"});
      expect(result.errCode).toEqual("");

      result = vvD.konsole(false,"Message hidden for console",{"key":"value"});
      expect(result.errCode).toEqual("");
  });//end it

  it("that have antipatterns that should fail ", function() {
      var result = vvD.modal(true,{"key":"value"});// 2nd parameter has type error
      expect(result.errCode).toEqual("not_a_string");

      result = vvD.modal(true);// too few parameters
      expect(result.errCode).toEqual("min_param_qty=2");

      result = vvD.modal("false","First parameter should be boolean not string");// 1st parameter type error
      expect(result.errCode).toEqual("not_boolean");
  });//end it








});//end describe
